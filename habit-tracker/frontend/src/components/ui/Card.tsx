import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className, children, onClick }) => (
  <div
    className={cn('bg-surface rounded-2xl border border-border', onClick && 'cursor-pointer hover:border-accent/50 transition-colors', className)}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('px-4 pt-4 pb-2', className)}>{children}</div>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('px-4 pb-4', className)}>{children}</div>
);
