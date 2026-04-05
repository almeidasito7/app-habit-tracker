import { Habit, CreateHabitDTO, UpdateHabitDTO } from '../entities/Habit';

export interface IHabitRepository {
  findById(id: string): Promise<Habit | null>;
  findByUserId(userId: string): Promise<Habit[]>;
  findActiveByUserId(userId: string): Promise<Habit[]>;
  create(data: CreateHabitDTO): Promise<Habit>;
  update(id: string, data: UpdateHabitDTO): Promise<Habit>;
  delete(id: string): Promise<void>;
}
