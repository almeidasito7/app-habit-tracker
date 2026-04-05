import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { GetGoalsUseCase, CreateGoalUseCase, UpdateGoalUseCase, DeleteGoalUseCase } from '../../../application/use-cases/goals/GoalUseCases';

export class GoalController {
  constructor(
    private getGoalsUseCase: GetGoalsUseCase,
    private createGoalUseCase: CreateGoalUseCase,
    private updateGoalUseCase: UpdateGoalUseCase,
    private deleteGoalUseCase: DeleteGoalUseCase
  ) {}

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const goals = await this.getGoalsUseCase.execute(req.userId!);
      res.json({ goals });
    } catch { res.status(500).json({ error: 'Failed to fetch goals' }); }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const goal = await this.createGoalUseCase.execute({ ...req.body, userId: req.userId! });
      res.status(201).json({ goal });
    } catch { res.status(500).json({ error: 'Failed to create goal' }); }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const goal = await this.updateGoalUseCase.execute(req.params.id, req.userId!, req.body);
      if (!goal) { res.status(404).json({ error: 'Goal not found' }); return; }
      res.json({ goal });
    } catch { res.status(500).json({ error: 'Failed to update goal' }); }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const success = await this.deleteGoalUseCase.execute(req.params.id, req.userId!);
      if (!success) { res.status(404).json({ error: 'Goal not found' }); return; }
      res.json({ message: 'Goal deleted successfully' });
    } catch { res.status(500).json({ error: 'Failed to delete goal' }); }
  };
}
