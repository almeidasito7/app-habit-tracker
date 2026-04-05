import { SupabaseClient } from '@supabase/supabase-js';
import { IOffensiveRepository } from '../../../domain/repositories/IOffensiveRepository';
import { Offensive, CreateOffensiveDTO, StreakStats, ActivityCell, DailyStats } from '../../../domain/entities/Offensive';

export class SupabaseOffensiveRepository implements IOffensiveRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapRow(row: Record<string, unknown>): Offensive {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      habitId: row.habit_id as string,
      completedDate: new Date(row.completed_date as string),
      createdAt: new Date(row.created_at as string),
    };
  }

  async findByHabitId(habitId: string): Promise<Offensive[]> {
    const { data, error } = await this.supabase
      .from('offensive')
      .select('*')
      .eq('habit_id', habitId)
      .order('completed_date', { ascending: false });
    if (error || !data) return [];
    return data.map(this.mapRow);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<Offensive[]> {
    const dateStr = date.toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('offensive')
      .select('*')
      .eq('user_id', userId)
      .eq('completed_date', dateStr);
    if (error || !data) return [];
    return data.map(this.mapRow);
  }

  async create(dto: CreateOffensiveDTO): Promise<Offensive> {
    const dateStr = (dto.completedDate || new Date()).toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('offensive')
      .insert({
        user_id: dto.userId,
        habit_id: dto.habitId,
        completed_date: dateStr,
      })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to create offensive');
    return this.mapRow(data);
  }

  async delete(habitId: string, date: Date): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0];
    const { error } = await this.supabase
      .from('offensive')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_date', dateStr);
    return !error;
  }

  async getStreakStats(habitId: string): Promise<StreakStats> {
    const { data } = await this.supabase
      .from('offensive')
      .select('completed_date')
      .eq('habit_id', habitId)
      .order('completed_date', { ascending: false });

    const dates = (data || []).map((c: Record<string, unknown>) => c.completed_date as string).sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        const dayDiff = Math.floor((new Date(today).getTime() - new Date(dates[0]).getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
        } else {
          tempStreak = 1;
        }
      } else {
        const dayDiff = Math.floor((new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          tempStreak++;
          if (i < currentStreak + 1) currentStreak = tempStreak;
        } else {
          if (currentStreak === 0) currentStreak = 0;
          tempStreak = 1;
        }
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    }

    return {
      currentStreak,
      bestStreak,
      totalCompletions: dates.length,
      completionRate: dates.length > 0 ? Math.min(100, Math.round((dates.length / 30) * 100)) : 0,
    };
  }

  async getActivityGrid(userId: string, weeks: number = 8): Promise<ActivityCell[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    const { data: habits } = await this.supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    const habitIds = (habits || []).map((h: Record<string, unknown>) => h.id as string);
    if (habitIds.length === 0) {
      const cells: ActivityCell[] = [];
      for (let i = 0; i < weeks * 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        cells.push({ date: d.toISOString().split('T')[0], count: 0, intensity: 0 });
      }
      return cells;
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const { data } = await this.supabase
      .from('offensive')
      .select('completed_date, habit_id')
      .eq('user_id', userId)
      .gte('completed_date', startStr)
      .lte('completed_date', endStr);

    const completionMap = new Map<string, number>();
    (data || []).forEach((row: Record<string, unknown>) => {
      const dateKey = row.completed_date as string;
      completionMap.set(dateKey, (completionMap.get(dateKey) || 0) + 1);
    });

    const cells: ActivityCell[] = [];
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const count = completionMap.get(dateStr) || 0;
      const maxPossible = habitIds.length;
      const ratio = maxPossible > 0 ? count / maxPossible : 0;
      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      if (ratio > 0) intensity = 1;
      if (ratio >= 0.25) intensity = 2;
      if (ratio >= 0.5) intensity = 3;
      if (ratio >= 0.75) intensity = 4;
      cells.push({ date: dateStr, count, intensity });
    }

    return cells;
  }

  async getDailyStats(userId: string, days: number = 30): Promise<DailyStats[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: habits } = await this.supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    const totalHabits = (habits || []).length;

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const { data } = await this.supabase
      .from('offensive')
      .select('completed_date')
      .eq('user_id', userId)
      .gte('completed_date', startStr)
      .lte('completed_date', endStr);

    const completionMap = new Map<string, number>();
    (data || []).forEach((row: Record<string, unknown>) => {
      const dateKey = row.completed_date as string;
      completionMap.set(dateKey, (completionMap.get(dateKey) || 0) + 1);
    });

    const stats: DailyStats[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const completed = completionMap.get(dateStr) || 0;
      stats.push({
        date: dateStr,
        completed,
        total: totalHabits,
        percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0,
      });
    }

    return stats;
  }

  async getTodayStats(userId: string): Promise<{ completed: number; total: number }> {
    const today = new Date().toISOString().split('T')[0];

    const { data: habits } = await this.supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    const { data: completions } = await this.supabase
      .from('offensive')
      .select('id')
      .eq('user_id', userId)
      .eq('completed_date', today);

    return {
      completed: (completions || []).length,
      total: (habits || []).length,
    };
  }
}
