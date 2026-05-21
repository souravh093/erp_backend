import { PlanType } from '../../../../generated/prisma/client';

export type TSubscriptionCheckoutPayload = {
  userId: string;
  plan: PlanType;
};

export type TSubscriptionStatusPayload = {
  userId: string;
};
