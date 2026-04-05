import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatDateHeader } from '../../utils';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-textPrimary">HabitAI</h1>
          <p className="text-xs text-textMuted">{formatDateHeader()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-surface transition-colors text-textMuted hover:text-textPrimary">
            <Bell size={20} />
          </button>
          <button
            className="p-2 rounded-xl hover:bg-surface transition-colors text-textMuted hover:text-textPrimary"
            onClick={() => navigate('/profile')}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full" />
            ) : (
              <Settings size={20} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
