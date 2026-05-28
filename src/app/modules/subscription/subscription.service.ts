import Stripe from 'stripe';
import {
  PlanType,
  SubscriptionStatus,
} from '../../../../generated/prisma/client';
import configs from '../../configs';
import AppError from '../../errors/AppError';
import {
  TSubscriptionCheckoutPayload,
  TSubscriptionStatusPayload,
} from './subscription.interface';
import { prisma } from '../../../db/db.config';

let stripeClient: Stripe | null = null;

const getStripeClient = () => {
  if (!configs.stripeSecretKey) {
    throw new AppError(500, 'Stripe secret key not configured');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(configs.stripeSecretKey, {
      apiVersion: '2024-06-20',
    });
  }

  return stripeClient;
};

const resolvePriceId = (plan: PlanType) => {
  if (plan === PlanType.MONTHLY) {
    return configs.stripeMonthlyPriceId;
  }

  if (plan === PlanType.YEARLY) {
    return configs.stripeYearlyPriceId;
  }

  return undefined;
};

const resolvePlanFromPriceId = (priceId?: string | null) => {
  if (!priceId) {
    return null;
  }

  if (priceId === configs.stripeMonthlyPriceId) {
    return PlanType.MONTHLY;
  }

  if (priceId === configs.stripeYearlyPriceId) {
    return PlanType.YEARLY;
  }

  return null;
};

const mapStripeStatus = (
  status: Stripe.Subscription.Status,
): SubscriptionStatus => {
  switch (status) {
    case 'active':
    case 'trialing':
      return SubscriptionStatus.ACTIVE;
    case 'canceled':
      return SubscriptionStatus.CANCELLED;
    case 'incomplete_expired':
    case 'unpaid':
      return SubscriptionStatus.EXPIRED;
    case 'past_due':
    case 'incomplete':
    default:
      return SubscriptionStatus.PENDING;
  }
};

const getStripeCustomerId = (
  customer: Stripe.Customer | Stripe.DeletedCustomer | string | null,
) => {
  if (!customer) {
    return null;
  }

  if (typeof customer === 'string') {
    return customer;
  }

  if ('deleted' in customer && customer.deleted) {
    return null;
  }

  return customer.id;
};

const syncSubscriptionFromStripe = async (
  stripeSubscription: Stripe.Subscription,
) => {
  const stripeCustomerId = getStripeCustomerId(stripeSubscription.customer);
  const planFromPrice = resolvePlanFromPriceId(
    stripeSubscription.items.data[0]?.price?.id,
  );
  const status = mapStripeStatus(stripeSubscription.status);
  const periodEnd = stripeSubscription.current_period_end
    ? new Date(stripeSubscription.current_period_end * 1000)
    : null;
  const userId = stripeSubscription.metadata?.userId;

  const whereClauses: Array<{
    stripe_subscription_id?: string;
    stripe_customer_id?: string;
    userId?: string;
  }> = [{ stripe_subscription_id: stripeSubscription.id }];

  if (stripeCustomerId) {
    whereClauses.push({ stripe_customer_id: stripeCustomerId });
  }

  if (userId) {
    whereClauses.push({ userId });
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      OR: whereClauses,
    },
  });

  if (!existingSubscription && userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return;
    }

    await prisma.subscription.create({
      data: {
        userId,
        companyId: user.companyId,
        plan: planFromPrice ?? PlanType.MONTHLY,
        status,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscription.id,
        expires_at: periodEnd,
        paid_at: status === SubscriptionStatus.ACTIVE ? new Date() : null,
      },
    });

    return;
  }

  if (!existingSubscription) {
    return;
  }

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      stripe_customer_id:
        stripeCustomerId ?? existingSubscription.stripe_customer_id,
      stripe_subscription_id: stripeSubscription.id,
      plan: planFromPrice ?? existingSubscription.plan,
      status,
      expires_at: periodEnd,
    },
  });
};

const createCheckoutSession = async (payload: TSubscriptionCheckoutPayload) => {
  const company = await prisma.company.findFirst({
    where: {
      users: { some: { id: payload.userId } },
    },
  });
  const stripe = getStripeClient();

  const priceId = resolvePriceId(payload.plan);

  if (!priceId) {
    throw new AppError(500, 'Stripe price id not configured');
  }

  if (!configs.stripeSuccessUrl || !configs.stripeCancelUrl) {
    throw new AppError(500, 'Stripe redirect URLs not configured');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  let stripeCustomerId = existingSubscription?.stripe_customer_id;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: company?.is_setup_complete
      ? configs.stripeSuccessUrl
      : configs.companySetupUrl,
    cancel_url: configs.stripeCancelUrl,
    metadata: {
      userId: user.id,
      plan: payload.plan,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        plan: payload.plan,
      },
    },
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan: payload.plan,
      status: SubscriptionStatus.PENDING,
      stripe_customer_id: stripeCustomerId,
    },
    create: {
      userId: user.id,
      companyId: user.companyId,
      plan: payload.plan,
      status: SubscriptionStatus.PENDING,
      stripe_customer_id: stripeCustomerId,
    },
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
};

const handleStripeWebhook = async (payload: Buffer, signature?: string) => {
  const stripe = getStripeClient();
  if (!signature) {
    throw new AppError(400, 'Missing Stripe signature');
  }

  if (!configs.stripeWebhookSecret) {
    throw new AppError(500, 'Stripe webhook secret not configured');
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    configs.stripeWebhookSecret,
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        break;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        break;
      }

      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;
      const stripeCustomerId = getStripeCustomerId(session.customer);
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;
      const status =
        session.payment_status === 'paid'
          ? SubscriptionStatus.ACTIVE
          : SubscriptionStatus.PENDING;
      const plan =
        session.metadata?.plan === 'YEARLY'
          ? PlanType.YEARLY
          : PlanType.MONTHLY;

      let periodEnd: Date | null = null;
      if (subscriptionId) {
        const stripeSubscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        periodEnd = stripeSubscription.current_period_end
          ? new Date(stripeSubscription.current_period_end * 1000)
          : null;
      }

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan,
          status,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: subscriptionId,
          stripe_payment_intent_id: paymentIntentId,
          expires_at: periodEnd,
          paid_at: status === SubscriptionStatus.ACTIVE ? new Date() : null,
        },
        create: {
          userId,
          companyId: user.companyId,
          plan,
          status,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: subscriptionId,
          stripe_payment_intent_id: paymentIntentId,
          expires_at: periodEnd,
          paid_at: status === SubscriptionStatus.ACTIVE ? new Date() : null,
        },
      });
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      await syncSubscriptionFromStripe(stripeSubscription);
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;

      if (subscriptionId) {
        await prisma.subscription.updateMany({
          where: { stripe_subscription_id: subscriptionId },
          data: {
            status: SubscriptionStatus.ACTIVE,
            paid_at: new Date(),
          },
        });
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;

      if (subscriptionId) {
        await prisma.subscription.updateMany({
          where: { stripe_subscription_id: subscriptionId },
          data: {
            status: SubscriptionStatus.PENDING,
          },
        });
      }
      break;
    }
    default:
      break;
  }
};

const getSubscriptionStatus = async (payload: TSubscriptionStatusPayload) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: payload.userId },
  });

  if (!subscription) {
    return {
      status: 'NONE',
      plan: null,
      expiresAt: null,
    };
  }

  return {
    status: subscription.status,
    plan: subscription.plan,
    expiresAt: subscription.expires_at,
  };
};

export const subscriptionServices = {
  createCheckoutSession,
  handleStripeWebhook,
  getSubscriptionStatus,
};
