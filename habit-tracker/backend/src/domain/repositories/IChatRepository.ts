export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface IChatRepository {
  findByUserId(userId: string, limit?: number): Promise<ChatMessage[]>;
  create(userId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage>;
  deleteByUserId(userId: string): Promise<boolean>;
}
