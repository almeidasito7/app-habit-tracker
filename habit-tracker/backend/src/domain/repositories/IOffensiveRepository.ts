import { Offensive, CreateOffensiveDTO, StreakStats, ActivityGridData } from '../entities/Offensive';

export interface IOffensiveRepository {
  findByHabitId(habitId: string): Promise<Offensive[]>;
  findByUserIdAndDate(userId: string, date: Date): Promise<Offensive[]>;
  findByUserIdDateRange(userId: string, startDate: Date, endDate: Date): Promise<Offensive[]>;
  create(data: CreateOffensiveDTO): Promise<Offensive>;
  delete(userId: string, habitId: string, date: Date): Promise<void>;
  isCompleted(habitId: string, date: Date): Promise<boolean>;
  getStreakStats(habitId: string): Promise<StreakStats>;
  getUserStats(userId: string): Promise<{
    totalHabitsToday: number;
    completedToday: number;
    currentStreak: number;
    bestStreak: number;
  }>;
  getActivityGrid(userId: string, weeks?: number): Promise<ActivityGridData[]>;
}
