import { IHabitRepository } from '../../../domain/repositories/IHabitRepository';

export class DeleteHabitUseCase {
  constructor(private habitRepository: IHabitRepository) {}

  async execute(id: string, userId: string): Promise<boolean> {
    const habit = await this.habitRepository.findById(id);
    if (!habit || habit.userId !== userId) {
      return false;
    }
    return this.habitRepository.delete(id);
  }
}
