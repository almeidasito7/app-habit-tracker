export type UserPlan = 'free' | 'pro' | 'premium';

export interface User {
  id: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  plan: UserPlan;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  id: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface UpdateUserDTO {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  plan?: UserPlan;
  stripeCustomerId?: string;
}
