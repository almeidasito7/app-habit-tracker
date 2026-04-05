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
  progress?: number;
}

export interface UpdateStudyDTO {
  title?: string;
  platform?: string;
  platformUrl?: string;
  emoji?: string;
  progress?: number;
  status?: StudyStatus;
}
