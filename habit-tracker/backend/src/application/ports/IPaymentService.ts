export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface IPaymentService {
  createCheckoutSession(userId: string, priceId: string, email: string): Promise<CheckoutSession>;
  createCustomer(userId: string, email: string, name?: string): Promise<string>;
  handleWebhook(payload: Buffer, signature: string): Promise<void>;
  cancelSubscription(customerId: string): Promise<void>;
}
