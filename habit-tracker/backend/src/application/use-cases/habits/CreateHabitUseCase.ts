import { IHabitRepository } from '../../../domain/repositories/IHabitRepository';
import { Habit, CreateHabitDTO } from '../../../domain/entities/Habit';

export class CreateHabitUseCase {
  constructor(private habitRepository: IHabitRepository) {}

  async execute(data: CreateHabitDTO): Promise<Habit> {
    return this.habitRepository.create(data);
  }
}
