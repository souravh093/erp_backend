import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { subscriptionServices } from './subscription.service';

const createCheckoutSession = catchAsync(async (req, res) => {
  const response = await subscriptionServices.createCheckoutSession(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Checkout session created successfully',
    data: response,
  });
});

const getSubscriptionStatus = catchAsync(async (req, res) => {
  const response = await subscriptionServices.getSubscriptionStatus(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription status fetched successfully',
    data: response,
  });
});

const handleStripeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature'];

  await subscriptionServices.handleStripeWebhook(
    req.body,
    typeof signature === 'string' ? signature : signature?.[0],
  );

  res.status(200).json({ received: true });
});

export const subscriptionController = {
  createCheckoutSession,
  getSubscriptionStatus,
  handleStripeWebhook,
};
