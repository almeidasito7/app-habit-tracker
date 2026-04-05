import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';
import { TodayStats } from '../../types';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  todayStats: TodayStats;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, bestStreak, todayStats }) => {
  const completionPercent = todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🔥
            </motion.span>
            <div>
              <div className="text-3xl font-black text-textPrimary">{currentStreak}</div>
              <div className="text-xs font-bold text-textMuted tracking-widest uppercase">Day Streak</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-textSecondary">{todayStats.completed}/{todayStats.total} today</div>
            <div className="text-2xl font-bold text-accent">{completionPercent}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-textMuted whitespace-nowrap">Best: {bestStreak}🏆</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold text-textPrimary">{todayStats.completed}</div>
            <div className="text-xs text-textMuted">Done</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-textPrimary">{todayStats.total - todayStats.completed}</div>
            <div className="text-xs text-textMuted">Left</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">{completionPercent}%</div>
            <div className="text-xs text-textMuted">Complete</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
