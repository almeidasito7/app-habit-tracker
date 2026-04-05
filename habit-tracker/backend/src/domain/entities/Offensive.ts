export interface Offensive {
  id: string;
  userId: string;
  habitId: string;
  completedDate: Date;
  createdAt: Date;
}

export interface CreateOffensiveDTO {
  userId: string;
  habitId: string;
  completedDate: Date;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  lastCompletedDate?: Date;
}

export interface ActivityGridData {
  date: string;
  count: number;
  percentage: number;
}

export class OffensiveEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly habitId: string,
    public readonly completedDate: Date,
    public readonly createdAt: Date
  ) {}

  static create(data: CreateOffensiveDTO, id: string): OffensiveEntity {
    return new OffensiveEntity(
      id,
      data.userId,
      data.habitId,
      data.completedDate,
      new Date()
    );
  }

  static fromPersistence(data: Offensive): OffensiveEntity {
    return new OffensiveEntity(
      data.id,
      data.userId,
      data.habitId,
      data.completedDate,
      data.createdAt
    );
  }

  toPersistence(): Offensive {
    return {
      id: this.id,
      userId: this.userId,
      habitId: this.habitId,
      completedDate: this.completedDate,
      createdAt: this.createdAt,
    };
  }
}

export function calculateStreak(completions: Date[]): StreakStats {
  if (completions.length === 0) {
    return { currentStreak: 0, bestStreak: 0, totalCompletions: 0 };
  }

  const sortedDates = [...completions]
    .map(d => new Date(d.toDateString()))
    .sort((a, b) => b.getTime() - a.getTime());

  const uniqueDates = [...new Set(sortedDates.map(d => d.toDateString()))]
    .map(s => new Date(s))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date(new Date().toDateString());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const mostRecent = uniqueDates[0];
  const isToday = mostRecent.getTime() === today.getTime();
  const isYesterday = mostRecent.getTime() === yesterday.getTime();

  if (!isToday && !isYesterday) {
    currentStreak = 0;
  } else {
    let expectedDate = isToday ? today : yesterday;
    for (const date of uniqueDates) {
      if (date.getTime() === expectedDate.getTime()) {
        currentStreak++;
        const prevDay = new Date(expectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        expectedDate = prevDay;
      } else {
        break;
      }
    }
  }

  let prevDate: Date | null = null;
  for (const date of [...uniqueDates].reverse()) {
    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const diffDays = (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    prevDate = date;
  }

  return {
    currentStreak,
    bestStreak,
    totalCompletions: uniqueDates.length,
    lastCompletedDate: uniqueDates[0],
  };
}
