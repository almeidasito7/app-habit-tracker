import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StreakCard } from '../components/habits/StreakCard';
import { ActivityGrid } from '../components/habits/ActivityGrid';
import { HabitCard } from '../components/habits/HabitCard';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { HabitForm } from '../components/habits/HabitForm';
import { habitsApi } from '../services/api';
import { useHabitsStore } from '../store/habitsStore';
import { HabitCategory, HabitWithStreak } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setHabits, setActivity, habits, activity, todayStats } = useHabitsStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Compute overall streak from habits
  const overallStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak)) : 0;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak)) : 0;

  const { isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitsApi.getAll,
    onSuccess: (data: HabitWithStreak[]) => setHabits(data),
  });

  const { isLoading: activityLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: () => habitsApi.getActivity(8),
    onSuccess: (data: { activity: typeof activity; todayStats: typeof todayStats }) => {
      setActivity(data.activity, data.todayStats);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: habitsApi.complete,
    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] });
      useHabitsStore.getState().toggleHabit(habitId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: habitsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setShowAddModal(false);
    },
  });

  const isLoading = habitsLoading || activityLoading;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-textPrimary">Habits</h2>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface rounded-2xl border border-border h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <StreakCard
              currentStreak={overallStreak}
              bestStreak={bestStreak}
              todayStats={todayStats}
            />

            <ActivityGrid activity={activity} />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider">Daily Habits</h3>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1 text-accent text-sm font-medium hover:text-accentHover transition-colors"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {habits.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🌱</div>
                    <p className="text-textSecondary text-sm font-medium">No habits yet</p>
                    <p className="text-textMuted text-xs mt-1">Tap &quot;Add&quot; to start building habits</p>
                    <button
                      onClick={() => navigate('/habit-adder')}
                      className="mt-3 text-accent text-sm font-medium hover:text-accentHover"
                    >
                      Browse habit templates →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <AnimatePresence>
                      {habits.map(habit => (
                        <motion.div
                          key={habit.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <HabitCard
                            habit={habit}
                            onToggle={(id) => toggleMutation.mutate(id)}
                            onEdit={(id) => navigate(`/habit-adder?edit=${id}`)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Habit">
        <HabitForm
          onSubmit={(data) => createMutation.mutate(data as Record<string, unknown>)}
          onCancel={() => setShowAddModal(false)}
          loading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
};
