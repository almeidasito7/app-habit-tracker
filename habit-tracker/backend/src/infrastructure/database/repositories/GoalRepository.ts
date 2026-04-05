import { SupabaseClient } from '@supabase/supabase-js';
import { IGoalRepository } from '../../../domain/repositories/IGoalRepository';
import { Goal, CreateGoalDTO, UpdateGoalDTO } from '../../../domain/entities/Goal';

export class SupabaseGoalRepository implements IGoalRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapRow(row: Record<string, unknown>): Goal {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      title: row.title as string,
      description: row.description as string | undefined,
      emoji: (row.emoji as string) || '🎯',
      category: (row.category as Goal['category']) || 'others',
      targetDate: row.target_date ? new Date(row.target_date as string) : undefined,
      progress: (row.progress as number) || 0,
      status: (row.status as Goal['status']) || 'active',
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  async findById(id: string): Promise<Goal | null> {
    const { data, error } = await this.supabase.from('goals').select('*').eq('id', id).single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async findByUserId(userId: string): Promise<Goal[]> {
    const { data, error } = await this.supabase
      .from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(this.mapRow);
  }

  async create(dto: CreateGoalDTO): Promise<Goal> {
    const { data, error } = await this.supabase.from('goals').insert({
      user_id: dto.userId,
      title: dto.title,
      description: dto.description,
      emoji: dto.emoji || '🎯',
      category: dto.category || 'others',
      target_date: dto.targetDate?.toISOString().split('T')[0],
      progress: dto.progress || 0,
    }).select().single();
    if (error || !data) throw new Error(error?.message || 'Failed to create goal');
    return this.mapRow(data);
  }

  async update(id: string, dto: UpdateGoalDTO): Promise<Goal | null> {
    const updateData: Record<string, unknown> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.emoji !== undefined) updateData.emoji = dto.emoji;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.targetDate !== undefined) updateData.target_date = dto.targetDate?.toISOString().split('T')[0];
    if (dto.progress !== undefined) updateData.progress = dto.progress;
    if (dto.status !== undefined) updateData.status = dto.status;
    const { data, error } = await this.supabase.from('goals').update(updateData).eq('id', id).select().single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('goals').delete().eq('id', id);
    return !error;
  }
}
