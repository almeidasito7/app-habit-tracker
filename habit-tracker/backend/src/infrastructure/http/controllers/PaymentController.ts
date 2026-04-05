import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { IPaymentService } from '../../../application/ports/IPaymentService';

export class PaymentController {
  constructor(private paymentService: IPaymentService) {}

  getPlans = async (_req: Request, res: Response): Promise<void> => {
    res.json({
      plans: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          interval: 'month',
          features: ['Up to 5 habits', 'Basic streak tracking', '30-day activity grid', 'AI chat (10/day)'],
          limits: { habits: 5, aiMessages: 10 },
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 9.99,
          interval: 'month',
          priceId: process.env.STRIPE_PRICE_PRO,
          features: ['Unlimited habits', 'Advanced analytics', '365-day activity grid', 'AI chat (100/day)', 'Goal tracking', 'Study tracker'],
          limits: { habits: -1, aiMessages: 100 },
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 19.99,
          interval: 'month',
          priceId: process.env.STRIPE_PRICE_PREMIUM,
          features: ['Everything in Pro', 'AI schedule generation', 'Priority support', 'Unlimited AI chat', 'Ability tree', 'Export data'],
          limits: { habits: -1, aiMessages: -1 },
        },
      ],
    });
  };

  createCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { priceId } = req.body;
      if (!priceId) { res.status(400).json({ error: 'Price ID required' }); return; }
      const session = await this.paymentService.createCheckoutSession(req.userId!, priceId, req.userEmail!);
      res.json(session);
    } catch { res.status(500).json({ error: 'Payment service unavailable' }); }
  };

  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      await this.paymentService.handleWebhook(req.body as Buffer, sig);
      res.json({ received: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Webhook error';
      res.status(400).json({ error: message });
    }
  };
}
