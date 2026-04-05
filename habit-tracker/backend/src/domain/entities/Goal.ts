export type GoalStatus = 'active' | 'completed' | 'paused';
export type GoalCategory = 'learning' | 'working' | 'health' | 'others' | 'fun' | 'evolution';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  emoji: string;
  category: GoalCategory;
  targetDate?: Date;
  progress: number;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalDTO {
  userId: string;
  title: string;
  description?: string;
  emoji?: string;
  category?: GoalCategory;
  targetDate?: Date;
  progress?: number;
}

export interface UpdateGoalDTO {
  title?: string;
  description?: string;
  emoji?: string;
  category?: GoalCategory;
  targetDate?: Date;
  progress?: number;
  status?: GoalStatus;
}
