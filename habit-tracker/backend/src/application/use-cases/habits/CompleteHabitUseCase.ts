import { IHabitRepository } from '../../../domain/repositories/IHabitRepository';
import { IOffensiveRepository } from '../../../domain/repositories/IOffensiveRepository';
import { Offensive } from '../../../domain/entities/Offensive';

export class CompleteHabitUseCase {
  constructor(
    private habitRepository: IHabitRepository,
    private offensiveRepository: IOffensiveRepository
  ) {}

  async execute(habitId: string, userId: string, date?: Date): Promise<{ completed: boolean; offensive?: Offensive }> {
    const habit = await this.habitRepository.findById(habitId);
    if (!habit || habit.userId !== userId) {
      return { completed: false };
    }

    const completedDate = date || new Date();
    const dateStr = completedDate.toISOString().split('T')[0];
    const checkDate = new Date(dateStr);
    
    const existingCompletions = await this.offensiveRepository.findByUserIdAndDate(userId, checkDate);
    const alreadyCompleted = existingCompletions.some(o => o.habitId === habitId);

    if (alreadyCompleted) {
      // Toggle off
      await this.offensiveRepository.delete(habitId, checkDate);
      return { completed: false };
    }

    const offensive = await this.offensiveRepository.create({
      userId,
      habitId,
      completedDate: checkDate,
    });

    return { completed: true, offensive };
  }
}
