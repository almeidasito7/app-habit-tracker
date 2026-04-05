import { IAIService } from '../../ports/IAIService';
import { IChatRepository } from '../../../domain/repositories/IChatRepository';

export class ChatUseCase {
  constructor(
    private aiService: IAIService,
    private chatRepository: IChatRepository
  ) {}

  async execute(userId: string, message: string, context?: { habits?: string[]; goals?: string[]; streak?: number }) {
    const history = await this.chatRepository.findByUserId(userId, 20);
    
    await this.chatRepository.create(userId, 'user', message);

    const response = await this.aiService.chat({
      messages: history,
      userMessage: message,
      userContext: context,
    });

    await this.chatRepository.create(userId, 'assistant', response.message);

    return response;
  }
}

export class SuggestHabitsUseCase {
  constructor(private aiService: IAIService) {}

  async execute(goals: string[], currentHabits: string[]) {
    return this.aiService.suggestHabits(goals, currentHabits);
  }
}

export class GenerateScheduleUseCase {
  constructor(private aiService: IAIService) {}

  async execute(habits: string[], preferences: Record<string, unknown>) {
    return this.aiService.generateSchedule(habits, preferences);
  }
}
