import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { GetHabitsUseCase } from '../../../application/use-cases/habits/GetHabitsUseCase';
import { CreateHabitUseCase } from '../../../application/use-cases/habits/CreateHabitUseCase';
import { UpdateHabitUseCase } from '../../../application/use-cases/habits/UpdateHabitUseCase';
import { DeleteHabitUseCase } from '../../../application/use-cases/habits/DeleteHabitUseCase';
import { CompleteHabitUseCase } from '../../../application/use-cases/habits/CompleteHabitUseCase';
import { GetStreakUseCase } from '../../../application/use-cases/habits/GetStreakUseCase';
import { IOffensiveRepository } from '../../../domain/repositories/IOffensiveRepository';

export class HabitController {
  constructor(
    private getHabitsUseCase: GetHabitsUseCase,
    private createHabitUseCase: CreateHabitUseCase,
    private updateHabitUseCase: UpdateHabitUseCase,
    private deleteHabitUseCase: DeleteHabitUseCase,
    private completeHabitUseCase: CompleteHabitUseCase,
    private getStreakUseCase: GetStreakUseCase,
    private offensiveRepository: IOffensiveRepository
  ) {}

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const habits = await this.getHabitsUseCase.execute(req.userId!);
      res.json({ habits });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch habits' });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const habit = await this.createHabitUseCase.execute({ ...req.body, userId: req.userId! });
      res.status(201).json({ habit });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create habit' });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const habit = await this.updateHabitUseCase.execute(req.params.id, req.userId!, req.body);
      if (!habit) { res.status(404).json({ error: 'Habit not found' }); return; }
      res.json({ habit });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update habit' });
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const success = await this.deleteHabitUseCase.execute(req.params.id, req.userId!);
      if (!success) { res.status(404).json({ error: 'Habit not found' }); return; }
      res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete habit' });
    }
  };

  complete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.completeHabitUseCase.execute(req.params.id, req.userId!);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle habit completion' });
    }
  };

  getStreak = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const streak = await this.getStreakUseCase.execute(req.params.id, req.userId!);
      if (!streak) { res.status(404).json({ error: 'Habit not found' }); return; }
      res.json({ streak });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get streak' });
    }
  };

  getActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const weeks = parseInt(req.query.weeks as string) || 8;
      const activity = await this.offensiveRepository.getActivityGrid(req.userId!, weeks);
      const todayStats = await this.offensiveRepository.getTodayStats(req.userId!);
      res.json({ activity, todayStats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get activity' });
    }
  };
}
