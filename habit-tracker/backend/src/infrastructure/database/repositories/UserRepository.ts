import { SupabaseClient } from '@supabase/supabase-js';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, CreateUserDTO, UpdateUserDTO } from '../../../domain/entities/User';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapRow(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      username: row.username as string | undefined,
      fullName: row.full_name as string | undefined,
      avatarUrl: row.avatar_url as string | undefined,
      plan: (row.plan as User['plan']) || 'free',
      stripeCustomerId: row.stripe_customer_id as string | undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase.from('users').select('*').eq('id', id).single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabase.from('users').select('*').eq('username', username).single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const { data, error } = await this.supabase.from('users').insert({
      id: dto.id,
      username: dto.username,
      full_name: dto.fullName,
      avatar_url: dto.avatarUrl,
    }).select().single();
    if (error || !data) throw new Error(error?.message || 'Failed to create user');
    return this.mapRow(data);
  }

  async update(id: string, dto: UpdateUserDTO): Promise<User | null> {
    const updateData: Record<string, unknown> = {};
    if (dto.username !== undefined) updateData.username = dto.username;
    if (dto.fullName !== undefined) updateData.full_name = dto.fullName;
    if (dto.avatarUrl !== undefined) updateData.avatar_url = dto.avatarUrl;
    if (dto.plan !== undefined) updateData.plan = dto.plan;
    if (dto.stripeCustomerId !== undefined) updateData.stripe_customer_id = dto.stripeCustomerId;
    const { data, error } = await this.supabase.from('users').update(updateData).eq('id', id).select().single();
    if (error || !data) return null;
    return this.mapRow(data);
  }
}
