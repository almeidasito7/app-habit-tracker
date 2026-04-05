import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { HabitController } from '../controllers/HabitController';
import { GoalController } from '../controllers/GoalController';
import { AIController } from '../controllers/AIController';
import { ProfileController } from '../controllers/ProfileController';
import { PaymentController } from '../controllers/PaymentController';

export function createRoutes(
  habitController: HabitController,
  goalController: GoalController,
  aiController: AIController,
  profileController: ProfileController,
  paymentController: PaymentController
): Router {
  const router = Router();

  // Health check
  router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  // Plans (public)
  router.get('/plans', paymentController.getPlans);

  // Payment webhook (raw body needed)
  router.post('/payment/webhook', paymentController.handleWebhook);

  // Protected routes
  router.use(authMiddleware);

  // Habits
  router.get('/habits', habitController.getAll);
  router.post('/habits', habitController.create);
  router.put('/habits/:id', habitController.update);
  router.delete('/habits/:id', habitController.delete);
  router.post('/habits/:id/complete', habitController.complete);
  router.get('/habits/:id/streak', habitController.getStreak);
  router.get('/offensive/activity', habitController.getActivity);

  // Goals
  router.get('/goals', goalController.getAll);
  router.post('/goals', goalController.create);
  router.put('/goals/:id', goalController.update);
  router.delete('/goals/:id', goalController.delete);

  // AI
  router.post('/ai/chat', aiController.chat);
  router.post('/ai/suggest-habits', aiController.suggestHabits);
  router.post('/ai/generate-schedule', aiController.generateSchedule);

  // Profile
  router.get('/profile', profileController.getProfile);
  router.put('/profile', profileController.updateProfile);

  // Payment
  router.post('/payment/create-checkout', paymentController.createCheckout);

  return router;
}
