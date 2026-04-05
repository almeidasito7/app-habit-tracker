import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { habitsApi } from '../services/api';
import { HabitWithStreak, HabitCategory } from '../types';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { categoryColors } from '../utils';

const CATEGORIES: { id: HabitCategory; label: string; emoji: string; description: string }[] = [
  { id: 'health', label: 'Health', emoji: '💪', description: 'Physical & mental wellness' },
  { id: 'learning', label: 'Learning', emoji: '📚', description: 'Knowledge & skills' },
  { id: 'working', label: 'Work', emoji: '💼', description: 'Career & productivity' },
  { id: 'fun', label: 'Fun', emoji: '🎮', description: 'Joy & creativity' },
  { id: 'evolution', label: 'Evolution', emoji: '🌱', description: 'Personal growth' },
  { id: 'others', label: 'Others', emoji: '⭐', description: 'Everything else' },
];

const getLevel = (streak: number, count: number): { level: number; title: string } => {
  const score = streak + count * 2;
  if (score >= 100) return { level: 5, title: 'Master' };
  if (score >= 50) return { level: 4, title: 'Expert' };
  if (score >= 20) return { level: 3, title: 'Skilled' };
  if (score >= 5) return { level: 2, title: 'Learner' };
  return { level: 1, title: 'Beginner' };
};

export const AbilityTreePage: React.FC = () => {
  const { data: habits = [] } = useQuery<HabitWithStreak[]>({
    queryKey: ['habits'],
    queryFn: habitsApi.getAll,
  });

  const categoryStats = CATEGORIES.map(cat => {
    const catHabits = habits.filter(h => h.category === cat.id);
    const totalStreak = catHabits.reduce((sum, h) => sum + h.currentStreak, 0);
    const avgCompletion = catHabits.length > 0
      ? Math.round(catHabits.reduce((sum, h) => sum + h.completionRate, 0) / catHabits.length)
      : 0;
    const { level, title } = getLevel(totalStreak, catHabits.length);
    return { ...cat, habits: catHabits, totalStreak, avgCompletion, level, title };
  });

  const totalLevel = Math.round(categoryStats.reduce((sum, c) => sum + c.level, 0) / CATEGORIES.length);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-textPrimary">Ability Tree</h2>
        <p className="text-textMuted text-sm">Your progress across life areas</p>
      </div>

      <Card>
        <CardContent className="pt-4 text-center">
          <div className="text-5xl mb-2">🌳</div>
          <div className="text-2xl font-black text-textPrimary">Level {totalLevel}</div>
          <div className="text-textMuted text-sm">Overall Progress</div>
          <div className="mt-3 flex justify-center gap-1">
            {[1,2,3,4,5].map(l => (
              <div key={l} className={`w-8 h-2 rounded-full ${l <= totalLevel ? 'bg-accent' : 'bg-border'}`} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {categoryStats.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${categoryColors[cat.id]}20` }}
                    >
                      {cat.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-textPrimary">{cat.label}</div>
                      <div className="text-xs text-textMuted">{cat.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold" style={{ color: categoryColors[cat.id] }}>{cat.title}</div>
                    <div className="text-xs text-textMuted">Lv. {cat.level}</div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs text-textMuted mb-1">
                    <span>{cat.habits.length} habits</span>
                    <span>{cat.avgCompletion}% avg</span>
                  </div>
                  <div className="bg-border rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: categoryColors[cat.id] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.level / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </div>

                {cat.habits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cat.habits.map(h => (
                      <span key={h.id} className="text-xs bg-surface border border-border px-2 py-0.5 rounded-full text-textSecondary">
                        {h.emoji} {h.name}
                      </span>
                    ))}
                  </div>
                )}

                {cat.habits.length === 0 && (
                  <p className="text-xs text-textMuted italic">No habits in this category yet</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
