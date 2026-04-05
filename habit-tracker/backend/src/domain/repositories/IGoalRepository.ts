import { Goal, CreateGoalDTO, UpdateGoalDTO } from '../entities/Goal';

export interface IGoalRepository {
  findById(id: string): Promise<Goal | null>;
  findByUserId(userId: string): Promise<Goal[]>;
  create(data: CreateGoalDTO): Promise<Goal>;
  update(id: string, data: UpdateGoalDTO): Promise<Goal | null>;
  delete(id: string): Promise<boolean>;
}
