import { IHabitRepository } from '../../../domain/repositories/IHabitRepository';
import { Habit, UpdateHabitDTO } from '../../../domain/entities/Habit';

export class UpdateHabitUseCase {
  constructor(private habitRepository: IHabitRepository) {}

  async execute(id: string, userId: string, data: UpdateHabitDTO): Promise<Habit | null> {
    const habit = await this.habitRepository.findById(id);
    if (!habit || habit.userId !== userId) {
      return null;
    }
    return this.habitRepository.update(id, data);
  }
}
