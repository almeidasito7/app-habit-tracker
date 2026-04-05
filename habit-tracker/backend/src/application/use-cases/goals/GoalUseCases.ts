import { IGoalRepository } from '../../../domain/repositories/IGoalRepository';
import { Goal, CreateGoalDTO, UpdateGoalDTO } from '../../../domain/entities/Goal';

export class GetGoalsUseCase {
  constructor(private goalRepository: IGoalRepository) {}
  async execute(userId: string): Promise<Goal[]> {
    return this.goalRepository.findByUserId(userId);
  }
}

export class CreateGoalUseCase {
  constructor(private goalRepository: IGoalRepository) {}
  async execute(data: CreateGoalDTO): Promise<Goal> {
    return this.goalRepository.create(data);
  }
}

export class UpdateGoalUseCase {
  constructor(private goalRepository: IGoalRepository) {}
  async execute(id: string, userId: string, data: UpdateGoalDTO): Promise<Goal | null> {
    const goal = await this.goalRepository.findById(id);
    if (!goal || goal.userId !== userId) return null;
    return this.goalRepository.update(id, data);
  }
}

export class DeleteGoalUseCase {
  constructor(private goalRepository: IGoalRepository) {}
  async execute(id: string, userId: string): Promise<boolean> {
    const goal = await this.goalRepository.findById(id);
    if (!goal || goal.userId !== userId) return false;
    return this.goalRepository.delete(id);
  }
}
