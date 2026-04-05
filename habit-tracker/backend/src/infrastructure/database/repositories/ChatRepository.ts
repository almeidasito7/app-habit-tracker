import { SupabaseClient } from '@supabase/supabase-js';
import { IChatRepository, ChatMessage } from '../../../domain/repositories/IChatRepository';

export class SupabaseChatRepository implements IChatRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapRow(row: Record<string, unknown>): ChatMessage {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      role: row.role as 'user' | 'assistant',
      content: row.content as string,
      createdAt: new Date(row.created_at as string),
    };
  }

  async findByUserId(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase
      .from('chat_messages').select('*').eq('user_id', userId)
      .order('created_at', { ascending: true }).limit(limit);
    if (error || !data) return [];
    return data.map(this.mapRow);
  }

  async create(userId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage> {
    const { data, error } = await this.supabase
      .from('chat_messages').insert({ user_id: userId, role, content }).select().single();
    if (error || !data) throw new Error(error?.message || 'Failed to save message');
    return this.mapRow(data);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const { error } = await this.supabase.from('chat_messages').delete().eq('user_id', userId);
    return !error;
  }
}
