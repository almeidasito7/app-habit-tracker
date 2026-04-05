import { create } from 'zustand';
import { HabitWithStreak, ActivityCell, TodayStats } from '../types';

interface HabitsState {
  habits: HabitWithStreak[];
  activity: ActivityCell[];
  todayStats: TodayStats;
  isLoading: boolean;
  setHabits: (habits: HabitWithStreak[]) => void;
  setActivity: (activity: ActivityCell[], todayStats: TodayStats) => void;
  toggleHabit: (habitId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: [],
  activity: [],
  todayStats: { completed: 0, total: 0 },
  isLoading: false,
  setHabits: (habits) => set({ habits }),
  setActivity: (activity, todayStats) => set({ activity, todayStats }),
  toggleHabit: (habitId) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completedToday: !h.completedToday,
              currentStreak: !h.completedToday ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
            }
          : h
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
