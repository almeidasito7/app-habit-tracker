import React from 'react';
import { cn } from '../../utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'sm', children, className }) => {
  const variantClasses = {
    default: 'bg-surface text-textSecondary border border-border',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    accent: 'bg-accent/20 text-accent',
  };
  const sizeClasses = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1' };

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </span>
  );
};
