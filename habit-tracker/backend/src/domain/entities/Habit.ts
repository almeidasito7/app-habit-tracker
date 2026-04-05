export type HabitCategory = 'learning' | 'working' | 'health' | 'others' | 'fun' | 'evolution';

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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHabitDTO {
  userId: string;
  name: string;
  emoji?: string;
  category?: HabitCategory;
  platform?: string;
  recurrenceDays?: number[];
  color?: string;
}

export interface UpdateHabitDTO {
  name?: string;
  emoji?: string;
  category?: HabitCategory;
  platform?: string;
  recurrenceDays?: number[];
  color?: string;
  isActive?: boolean;
}

export interface HabitWithStreak extends Habit {
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  completionRate: number;
}
