export interface Offensive {
  id: string;
  userId: string;
  habitId: string;
  completedDate: Date;
  createdAt: Date;
}

export interface CreateOffensiveDTO {
  userId: string;
  habitId: string;
  completedDate?: Date;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate: number;
}

export interface ActivityCell {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}
