import { IOffensiveRepository } from '../../../domain/repositories/IOffensiveRepository';
import { IHabitRepository } from '../../../domain/repositories/IHabitRepository';
import { StreakStats } from '../../../domain/entities/Offensive';

export class GetStreakUseCase {
  constructor(
    private habitRepository: IHabitRepository,
    private offensiveRepository: IOffensiveRepository
  ) {}

  async execute(habitId: string, userId: string): Promise<StreakStats | null> {
    const habit = await this.habitRepository.findById(habitId);
    if (!habit || habit.userId !== userId) {
      return null;
    }
    return this.offensiveRepository.getStreakStats(habitId);
  }
}
