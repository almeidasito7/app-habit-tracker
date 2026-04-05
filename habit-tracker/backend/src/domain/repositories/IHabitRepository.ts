import { Habit, CreateHabitDTO, UpdateHabitDTO, HabitWithStreak } from '../entities/Habit';

export interface IHabitRepository {
  findById(id: string): Promise<Habit | null>;
  findByUserId(userId: string): Promise<Habit[]>;
  findActiveByUserId(userId: string): Promise<Habit[]>;
  create(data: CreateHabitDTO): Promise<Habit>;
  update(id: string, data: UpdateHabitDTO): Promise<Habit | null>;
  delete(id: string): Promise<boolean>;
  findWithStreak(id: string, userId: string): Promise<HabitWithStreak | null>;
  findAllWithStreak(userId: string): Promise<HabitWithStreak[]>;
}
