import { Offensive, CreateOffensiveDTO, StreakStats, ActivityCell, DailyStats } from '../entities/Offensive';

export interface IOffensiveRepository {
  findByHabitId(habitId: string): Promise<Offensive[]>;
  findByUserIdAndDate(userId: string, date: Date): Promise<Offensive[]>;
  create(data: CreateOffensiveDTO): Promise<Offensive>;
  delete(habitId: string, date: Date): Promise<boolean>;
  getStreakStats(habitId: string): Promise<StreakStats>;
  getActivityGrid(userId: string, weeks?: number): Promise<ActivityCell[]>;
  getDailyStats(userId: string, days?: number): Promise<DailyStats[]>;
  getTodayStats(userId: string): Promise<{ completed: number; total: number }>;
}
