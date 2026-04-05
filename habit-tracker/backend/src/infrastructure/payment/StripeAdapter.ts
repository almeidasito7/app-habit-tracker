import Stripe from 'stripe';
import { IPaymentService, CheckoutSession } from '../../application/ports/IPaymentService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class StripeAdapter implements IPaymentService {
  private stripe: Stripe;
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    });
    this.userRepository = userRepository;
  }

  async createCustomer(userId: string, email: string, name?: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });

    await this.userRepository.update(userId, { stripeCustomerId: customer.id });
    return customer.id;
  }

  async createCheckoutSession(userId: string, priceId: string, email: string): Promise<CheckoutSession> {
    const user = await this.userRepository.findById(userId);
    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      customerId = await this.createCustomer(userId, email, user?.fullName);
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/plans`,
      metadata: { userId },
    });

    return { sessionId: session.id, url: session.url! };
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
      throw new Error('Invalid webhook signature');
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata?.userId;
        if (userId) {
          const priceId = subscription.items.data[0]?.price.id;
          let plan: 'free' | 'pro' | 'premium' = 'free';
          if (priceId === process.env.STRIPE_PRICE_PRO) plan = 'pro';
          if (priceId === process.env.STRIPE_PRICE_PREMIUM) plan = 'premium';
          await this.userRepository.update(userId, { plan });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
        const userId = customer.metadata?.userId;
        if (userId) {
          await this.userRepository.update(userId, { plan: 'free' });
        }
        break;
      }
    }
  }

  async cancelSubscription(customerId: string): Promise<void> {
    const subscriptions = await this.stripe.subscriptions.list({ customer: customerId, status: 'active' });
    for (const sub of subscriptions.data) {
      await this.stripe.subscriptions.cancel(sub.id);
    }
  }
}
