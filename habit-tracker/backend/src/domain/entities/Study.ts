export type StudyStatus = 'active' | 'completed' | 'paused';

export interface Study {
  id: string;
  userId: string;
  title: string;
  platform?: string;
  platformUrl?: string;
  emoji: string;
  progress: number;
  status: StudyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudyDTO {
  userId: string;
  title: string;
  platform?: string;
  platformUrl?: string;
  emoji?: string;
}

export interface UpdateStudyDTO {
  title?: string;
  platform?: string;
  platformUrl?: string;
  emoji?: string;
  progress?: number;
  status?: StudyStatus;
}

export class StudyEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public platform: string | undefined,
    public platformUrl: string | undefined,
    public emoji: string,
    public progress: number,
    public status: StudyStatus,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: CreateStudyDTO, id: string): StudyEntity {
    return new StudyEntity(
      id,
      data.userId,
      data.title,
      data.platform,
      data.platformUrl,
      data.emoji || '📚',
      0,
      'active',
      new Date(),
      new Date()
    );
  }

  static fromPersistence(data: Study): StudyEntity {
    return new StudyEntity(
      data.id,
      data.userId,
      data.title,
      data.platform,
      data.platformUrl,
      data.emoji,
      data.progress,
      data.status,
      data.createdAt,
      data.updatedAt
    );
  }

  update(data: UpdateStudyDTO): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.platform !== undefined) this.platform = data.platform;
    if (data.platformUrl !== undefined) this.platformUrl = data.platformUrl;
    if (data.emoji !== undefined) this.emoji = data.emoji;
    if (data.progress !== undefined) this.progress = Math.min(100, Math.max(0, data.progress));
    if (data.status !== undefined) this.status = data.status;
    this.updatedAt = new Date();
  }

  toPersistence(): Study {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      platform: this.platform,
      platformUrl: this.platformUrl,
      emoji: this.emoji,
      progress: this.progress,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
