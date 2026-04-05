import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Crown, ChevronRight, Edit2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/api';
import { authService } from '../services/supabase';
import { useAuthStore } from '../store/authStore';
import { useHabitsStore } from '../store/habitsStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';

const planColors = { free: 'default', pro: 'warning', premium: 'accent' } as const;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { habits, todayStats } = useHabitsStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.get,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { fullName: string }) => profileApi.update(data as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setShowEditModal(false);
    },
  });

  const handleLogout = async () => {
    await authService.signOut();
    logout();
    navigate('/login');
  };

  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak)) : 0;
  const totalCompleted = habits.reduce((sum, h) => sum + (h.completedToday ? 1 : 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-textPrimary">Profile</h2>

      {/* User Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-surface rounded-2xl border border-border p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-14 h-14 rounded-2xl object-cover" />
              ) : (
                <User size={24} className="text-accent" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-textPrimary truncate">
                    {user?.fullName || 'Anonymous User'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={planColors[user?.plan || 'free']}>
                      {user?.plan?.toUpperCase() || 'FREE'}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => { setEditName(user?.fullName || ''); setShowEditModal(true); }}
                  className="p-2 rounded-xl hover:bg-surfaceHover text-textMuted hover:text-textPrimary transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-xl font-black text-textPrimary">{habits.length}</div>
              <div className="text-xs text-textMuted">Habits</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-accent">{maxStreak}</div>
              <div className="text-xs text-textMuted">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-textPrimary">{totalCompleted}</div>
              <div className="text-xs text-textMuted">Today</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-1">
        <button
          onClick={() => navigate('/plans')}
          className="w-full flex items-center justify-between p-4 bg-surface rounded-2xl border border-border hover:border-accent/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Crown size={18} className="text-accent" />
            <span className="text-sm font-medium text-textPrimary">Upgrade Plan</span>
          </div>
          <ChevronRight size={16} className="text-textMuted" />
        </button>
      </div>

      <Button variant="danger" onClick={handleLogout} className="w-full">
        <LogOut size={16} />
        Sign Out
      </Button>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Your name"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
            <Button
              onClick={() => updateMutation.mutate({ fullName: editName })}
              loading={updateMutation.isPending}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
