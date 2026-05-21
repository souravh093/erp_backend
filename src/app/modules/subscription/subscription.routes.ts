import { Router } from 'express';
import validation from '../../middlewares/validation';
import { subscriptionController } from './subscription.controller';
import { subscriptionValidation } from './subscription.validation';

const router = Router();

router.post(
  '/checkout',
  validation(subscriptionValidation.createCheckoutSession),
  subscriptionController.createCheckoutSession,
);

router.post(
  '/status',
  validation(subscriptionValidation.status),
  subscriptionController.getSubscriptionStatus,
);

router.post('/webhook', subscriptionController.handleStripeWebhook);

export const subscriptionRoutes = router;
