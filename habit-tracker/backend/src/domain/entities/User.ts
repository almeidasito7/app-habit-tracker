export type Plan = 'free' | 'pro' | 'premium';

export interface User {
  id: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  plan: Plan;
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
  plan?: Plan;
  stripeCustomerId?: string;
}

export class UserEntity {
  private constructor(
    public readonly id: string,
    public username: string | undefined,
    public fullName: string | undefined,
    public avatarUrl: string | undefined,
    public plan: Plan,
    public stripeCustomerId: string | undefined,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: CreateUserDTO): UserEntity {
    return new UserEntity(
      data.id,
      data.username,
      data.fullName,
      data.avatarUrl,
      'free',
      undefined,
      new Date(),
      new Date()
    );
  }

  static fromPersistence(data: User): UserEntity {
    return new UserEntity(
      data.id,
      data.username,
      data.fullName,
      data.avatarUrl,
      data.plan,
      data.stripeCustomerId,
      data.createdAt,
      data.updatedAt
    );
  }

  update(data: UpdateUserDTO): void {
    if (data.username !== undefined) this.username = data.username;
    if (data.fullName !== undefined) this.fullName = data.fullName;
    if (data.avatarUrl !== undefined) this.avatarUrl = data.avatarUrl;
    if (data.plan !== undefined) this.plan = data.plan;
    if (data.stripeCustomerId !== undefined) this.stripeCustomerId = data.stripeCustomerId;
    this.updatedAt = new Date();
  }

  toPersistence(): User {
    return {
      id: this.id,
      username: this.username,
      fullName: this.fullName,
      avatarUrl: this.avatarUrl,
      plan: this.plan,
      stripeCustomerId: this.stripeCustomerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isProOrPremium(): boolean {
    return this.plan === 'pro' || this.plan === 'premium';
  }

  isPremium(): boolean {
    return this.plan === 'premium';
  }
}
