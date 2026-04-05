import React from 'react';
import { motion } from 'framer-motion';
import { Flame, MoreVertical } from 'lucide-react';
import { HabitWithStreak } from '../../types';
import { cn } from '../../utils';

interface HabitCardProps {
  habit: HabitWithStreak;
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onEdit }) => {
  return (
    <motion.div
      layout
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
        habit.completedToday ? 'bg-surface' : 'bg-surface hover:bg-surfaceHover'
      )}
    >
      <button
        onClick={() => onToggle(habit.id)}
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
          habit.completedToday
            ? 'bg-accent border-accent'
            : 'border-border hover:border-accent'
        )}
      >
        {habit.completedToday && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="12" height="12" viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </button>

      <span className="text-xl flex-shrink-0">{habit.emoji}</span>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', habit.completedToday ? 'line-through text-textMuted' : 'text-textPrimary')}>
          {habit.name}
        </p>
        {habit.currentStreak > 0 && (
          <div className="flex items-center gap-0.5">
            <Flame size={11} className="text-accent" />
            <span className="text-xs text-textMuted">{habit.currentStreak}d</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onEdit?.(habit.id)}
        className="text-textMuted hover:text-textPrimary p-1 rounded-lg hover:bg-border transition-colors"
      >
        <MoreVertical size={16} />
      </button>
    </motion.div>
  );
};
