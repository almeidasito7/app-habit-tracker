import React from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-textSecondary mb-1.5">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted">{icon}</div>}
      <input
        className={cn(
          'bg-surface border border-border rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted',
          'focus:outline-none focus:border-accent transition-colors w-full',
          icon && 'pl-10',
          error && 'border-error',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
);
