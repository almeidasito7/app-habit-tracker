export type GoalStatus = 'active' | 'completed' | 'paused';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  emoji: string;
  category: string;
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
  category?: string;
  targetDate?: Date;
}

export interface UpdateGoalDTO {
  title?: string;
  description?: string;
  emoji?: string;
  category?: string;
  targetDate?: Date;
  progress?: number;
  status?: GoalStatus;
}

export class GoalEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public description: string | undefined,
    public emoji: string,
    public category: string,
    public targetDate: Date | undefined,
    public progress: number,
    public status: GoalStatus,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: CreateGoalDTO, id: string): GoalEntity {
    return new GoalEntity(
      id,
      data.userId,
      data.title,
      data.description,
      data.emoji || '🎯',
      data.category || 'others',
      data.targetDate,
      0,
      'active',
      new Date(),
      new Date()
    );
  }

  static fromPersistence(data: Goal): GoalEntity {
    return new GoalEntity(
      data.id,
      data.userId,
      data.title,
      data.description,
      data.emoji,
      data.category,
      data.targetDate,
      data.progress,
      data.status,
      data.createdAt,
      data.updatedAt
    );
  }

  update(data: UpdateGoalDTO): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.emoji !== undefined) this.emoji = data.emoji;
    if (data.category !== undefined) this.category = data.category;
    if (data.targetDate !== undefined) this.targetDate = data.targetDate;
    if (data.progress !== undefined) this.progress = Math.min(100, Math.max(0, data.progress));
    if (data.status !== undefined) this.status = data.status;
    this.updatedAt = new Date();
  }

  complete(): void {
    this.progress = 100;
    this.status = 'completed';
    this.updatedAt = new Date();
  }

  isOverdue(): boolean {
    if (!this.targetDate) return false;
    return this.targetDate < new Date() && this.status === 'active';
  }

  toPersistence(): Goal {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      emoji: this.emoji,
      category: this.category,
      targetDate: this.targetDate,
      progress: this.progress,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
