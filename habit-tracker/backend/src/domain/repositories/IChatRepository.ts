export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface CreateChatMessageDTO {
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface IChatRepository {
  findByUserId(userId: string, limit?: number): Promise<ChatMessage[]>;
  create(data: CreateChatMessageDTO): Promise<ChatMessage>;
  deleteByUserId(userId: string): Promise<void>;
}
