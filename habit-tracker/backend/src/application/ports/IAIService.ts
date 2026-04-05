import { ChatMessage } from '../../domain/repositories/IChatRepository';

export interface ChatRequest {
  messages: ChatMessage[];
  userMessage: string;
  userContext?: {
    habits?: string[];
    goals?: string[];
    streak?: number;
  };
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export interface HabitSuggestion {
  name: string;
  emoji: string;
  category: string;
  reason: string;
}

export interface ScheduleItem {
  time: string;
  activity: string;
  duration: number;
  habitId?: string;
}

export interface IAIService {
  chat(request: ChatRequest): Promise<ChatResponse>;
  suggestHabits(goals: string[], currentHabits: string[]): Promise<HabitSuggestion[]>;
  generateSchedule(habits: string[], preferences: Record<string, unknown>): Promise<ScheduleItem[]>;
}
