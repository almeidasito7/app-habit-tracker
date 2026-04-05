import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { ChatUseCase, SuggestHabitsUseCase, GenerateScheduleUseCase } from '../../../application/use-cases/ai/AIUseCases';

export class AIController {
  constructor(
    private chatUseCase: ChatUseCase,
    private suggestHabitsUseCase: SuggestHabitsUseCase,
    private generateScheduleUseCase: GenerateScheduleUseCase
  ) {}

  chat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { message, context } = req.body;
      if (!message) { res.status(400).json({ error: 'Message is required' }); return; }
      const response = await this.chatUseCase.execute(req.userId!, message, context);
      res.json(response);
    } catch { res.status(500).json({ error: 'AI service unavailable' }); }
  };

  suggestHabits = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { goals = [], currentHabits = [] } = req.body;
      const suggestions = await this.suggestHabitsUseCase.execute(goals, currentHabits);
      res.json({ suggestions });
    } catch { res.status(500).json({ error: 'AI service unavailable' }); }
  };

  generateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { habits = [], preferences = {} } = req.body;
      const schedule = await this.generateScheduleUseCase.execute(habits, preferences);
      res.json({ schedule });
    } catch { res.status(500).json({ error: 'AI service unavailable' }); }
  };
}
