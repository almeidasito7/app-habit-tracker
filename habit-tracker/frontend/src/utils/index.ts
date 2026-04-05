import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDateHeader = (date: Date = new Date()): string => {
  return format(date, 'EEEE, MMMM d');
};

export const getCompletionColor = (intensity: 0 | 1 | 2 | 3 | 4): string => {
  const colors = {
    0: '#2a2a2a',
    1: '#7c3312',
    2: '#b84f1d',
    3: '#e07028',
    4: '#f97316',
  };
  return colors[intensity];
};

export const categoryColors: Record<string, string> = {
  learning: '#3b82f6',
  working: '#8b5cf6',
  health: '#22c55e',
  others: '#6b7280',
  fun: '#ec4899',
  evolution: '#f97316',
};

export const categoryEmojis: Record<string, string> = {
  learning: '📚',
  working: '💼',
  health: '💪',
  others: '⭐',
  fun: '🎮',
  evolution: '🌱',
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getStreakEmoji = (streak: number): string => {
  if (streak >= 100) return '🏆';
  if (streak >= 50) return '💎';
  if (streak >= 30) return '🔥';
  if (streak >= 7) return '⚡';
  if (streak >= 3) return '✨';
  return '🌱';
};
