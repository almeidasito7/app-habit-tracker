import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { GetProfileUseCase, UpdateProfileUseCase } from '../../../application/use-cases/auth/AuthUseCases';

export class ProfileController {
  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private updateProfileUseCase: UpdateProfileUseCase
  ) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.getProfileUseCase.execute(req.userId!);
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      res.json({ user });
    } catch { res.status(500).json({ error: 'Failed to fetch profile' }); }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.updateProfileUseCase.execute(req.userId!, req.body);
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }
      res.json({ user });
    } catch { res.status(500).json({ error: 'Failed to update profile' }); }
  };
}
