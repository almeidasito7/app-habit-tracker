import { SupabaseClient } from '@supabase/supabase-js';
import { IHabitRepository } from '../../../domain/repositories/IHabitRepository';
import { Habit, CreateHabitDTO, UpdateHabitDTO, HabitWithStreak } from '../../../domain/entities/Habit';

export class SupabaseHabitRepository implements IHabitRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapRow(row: Record<string, unknown>): Habit {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      name: row.name as string,
      emoji: (row.emoji as string) || '⭐',
      category: (row.category as Habit['category']) || 'others',
      platform: row.platform as string | undefined,
      recurrenceDays: (row.recurrence_days as number[]) || [1, 2, 3, 4, 5, 6, 7],
      color: (row.color as string) || '#f97316',
      isActive: row.is_active as boolean,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  async findById(id: string): Promise<Habit | null> {
    const { data, error } = await this.supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async findByUserId(userId: string): Promise<Habit[]> {
    const { data, error } = await this.supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(this.mapRow);
  }

  async findActiveByUserId(userId: string): Promise<Habit[]> {
    const { data, error } = await this.supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(this.mapRow);
  }

  async create(dto: CreateHabitDTO): Promise<Habit> {
    const { data, error } = await this.supabase
      .from('habits')
      .insert({
        user_id: dto.userId,
        name: dto.name,
        emoji: dto.emoji || '⭐',
        category: dto.category || 'others',
        platform: dto.platform,
        recurrence_days: dto.recurrenceDays || [1, 2, 3, 4, 5, 6, 7],
        color: dto.color || '#f97316',
      })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to create habit');
    return this.mapRow(data);
  }

  async update(id: string, dto: UpdateHabitDTO): Promise<Habit | null> {
    const updateData: Record<string, unknown> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.emoji !== undefined) updateData.emoji = dto.emoji;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.platform !== undefined) updateData.platform = dto.platform;
    if (dto.recurrenceDays !== undefined) updateData.recurrence_days = dto.recurrenceDays;
    if (dto.color !== undefined) updateData.color = dto.color;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;

    const { data, error } = await this.supabase
      .from('habits')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('habits').delete().eq('id', id);
    return !error;
  }

  async findWithStreak(id: string, userId: string): Promise<HabitWithStreak | null> {
    const habit = await this.findById(id);
    if (!habit || habit.userId !== userId) return null;

    const { data: completions } = await this.supabase
      .from('offensive')
      .select('completed_date')
      .eq('habit_id', id)
      .order('completed_date', { ascending: false });

    const dates = (completions || []).map((c: Record<string, unknown>) => c.completed_date as string);
    const today = new Date().toISOString().split('T')[0];
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    const sortedDates = [...dates].sort((a, b) => b.localeCompare(a));
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
      
      if (i === 0) {
        const dayDiff = Math.floor((new Date(today).getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else if (prevDate) {
        const dayDiff = Math.floor((prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          tempStreak++;
          if (i < currentStreak + 1) currentStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    }

    const completedToday = dates.includes(today);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompletions = dates.filter(d => new Date(d) >= thirtyDaysAgo).length;
    const completionRate = Math.round((recentCompletions / 30) * 100);

    return {
      ...habit,
      currentStreak,
      bestStreak,
      completedToday,
      completionRate,
    };
  }

  async findAllWithStreak(userId: string): Promise<HabitWithStreak[]> {
    const habits = await this.findActiveByUserId(userId);
    return Promise.all(habits.map(h => this.findWithStreak(h.id, userId) as Promise<HabitWithStreak>));
  }
}
