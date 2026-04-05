import { IHabitRepository } from '../../../domain/repositories/IHabitRepository';
import { HabitWithStreak } from '../../../domain/entities/Habit';

export class GetHabitsUseCase {
  constructor(private habitRepository: IHabitRepository) {}

  async execute(userId: string): Promise<HabitWithStreak[]> {
    return this.habitRepository.findAllWithStreak(userId);
  }
}
