export type UserPlan = 'free' | 'pro' | 'premium';
export type HabitCategory = 'learning' | 'working' | 'health' | 'others' | 'fun' | 'evolution';
export type GoalStatus = 'active' | 'completed' | 'paused';

export interface User {
  id: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  plan: UserPlan;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  platform?: string;
  recurrenceDays: number[];
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitWithStreak extends Habit {
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  completionRate: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  emoji: string;
  category: HabitCategory;
  targetDate?: string;
  progress: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityCell {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  priceId?: string;
  features: string[];
  limits: { habits: number; aiMessages: number };
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate: number;
}

export interface TodayStats {
  completed: number;
  total: number;
}
