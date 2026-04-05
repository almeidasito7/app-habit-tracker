export type HabitCategory = 'learning' | 'working' | 'health' | 'others' | 'fun' | 'evolution';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  platform?: string;
  recurrenceDays: number[];
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHabitDTO {
  userId: string;
  name: string;
  emoji?: string;
  category?: HabitCategory;
  platform?: string;
  recurrenceDays?: number[];
  color?: string;
}

export interface UpdateHabitDTO {
  name?: string;
  emoji?: string;
  category?: HabitCategory;
  platform?: string;
  recurrenceDays?: number[];
  color?: string;
  isActive?: boolean;
}

export class HabitEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public emoji: string,
    public category: HabitCategory,
    public platform: string | undefined,
    public recurrenceDays: number[],
    public color: string,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: CreateHabitDTO, id: string): HabitEntity {
    return new HabitEntity(
      id,
      data.userId,
      data.name,
      data.emoji || '⭐',
      data.category || 'others',
      data.platform,
      data.recurrenceDays || [1, 2, 3, 4, 5, 6, 7],
      data.color || '#f97316',
      true,
      new Date(),
      new Date()
    );
  }

  static fromPersistence(data: Habit): HabitEntity {
    return new HabitEntity(
      data.id,
      data.userId,
      data.name,
      data.emoji,
      data.category,
      data.platform,
      data.recurrenceDays,
      data.color,
      data.isActive,
      data.createdAt,
      data.updatedAt
    );
  }

  update(data: UpdateHabitDTO): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.emoji !== undefined) this.emoji = data.emoji;
    if (data.category !== undefined) this.category = data.category;
    if (data.platform !== undefined) this.platform = data.platform;
    if (data.recurrenceDays !== undefined) this.recurrenceDays = data.recurrenceDays;
    if (data.color !== undefined) this.color = data.color;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    this.updatedAt = new Date();
  }

  archive(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  isScheduledFor(dayOfWeek: number): boolean {
    return this.recurrenceDays.includes(dayOfWeek);
  }

  toPersistence(): Habit {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      emoji: this.emoji,
      category: this.category,
      platform: this.platform,
      recurrenceDays: this.recurrenceDays,
      color: this.color,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
