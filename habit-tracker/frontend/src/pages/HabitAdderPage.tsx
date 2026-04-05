import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { habitsApi } from '../services/api';

const PRESET_HABITS = [
  { name: 'Exercise', emoji: '💪', category: 'health' },
  { name: 'Read', emoji: '📚', category: 'learning' },
  { name: 'Meditate', emoji: '🧘', category: 'health' },
  { name: 'Drink Water', emoji: '💧', category: 'health' },
  { name: 'Sleep Early', emoji: '🌙', category: 'health' },
  { name: 'Journal', emoji: '📔', category: 'others' },
  { name: 'Code', emoji: '💻', category: 'learning' },
  { name: 'Learn Language', emoji: '🗣️', category: 'learning' },
  { name: 'Walk', emoji: '🚶', category: 'health' },
  { name: 'Eat Healthy', emoji: '🥗', category: 'health' },
  { name: 'Stretch', emoji: '🤸', category: 'health' },
  { name: 'Practice Music', emoji: '🎵', category: 'fun' },
  { name: 'Create Art', emoji: '🎨', category: 'fun' },
  { name: 'Clean', emoji: '🧹', category: 'others' },
  { name: 'Deep Focus', emoji: '🔥', category: 'working' },
  { name: 'Other', emoji: '⭐', category: 'others' },
];

const EMOJIS = ['⭐', '💪', '📚', '🏃', '💧', '🌙', '📔', '💻', '🎯', '🥗', '🧘', '🎵', '🎨', '🧹', '🔥', '🌱', '🚴', '🏊', '🧠', '💡'];

export const HabitAdderPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<typeof PRESET_HABITS[0] | null>(null);
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('⭐');
  const [isCustom, setIsCustom] = useState(false);

  const mutation = useMutation({
    mutationFn: habitsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      navigate('/');
    },
  });

  const handleAdd = () => {
    if (isCustom) {
      if (!customName.trim()) return;
      mutation.mutate({ name: customName.trim(), emoji: customEmoji, category: 'others', color: '#f97316' });
    } else if (selected) {
      mutation.mutate({ name: selected.name, emoji: selected.emoji, category: selected.category, color: '#f97316' });
    }
  };

  const handlePresetClick = (habit: typeof PRESET_HABITS[0]) => {
    if (habit.name === 'Other') {
      setIsCustom(true);
      setSelected(null);
    } else {
      setSelected(habit);
      setIsCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-textPrimary">Add Habit</h2>
        <button onClick={() => navigate('/')} className="text-textMuted hover:text-textPrimary text-sm">Cancel</button>
      </div>

      <p className="text-textSecondary text-sm">Choose a habit to build or create your own</p>

      <div className="grid grid-cols-4 gap-2">
        {PRESET_HABITS.map((habit) => (
          <motion.button
            key={habit.name}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePresetClick(habit)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-200 ${
              selected?.name === habit.name
                ? 'bg-accent/20 border-accent'
                : 'bg-surface border-border hover:border-accent/50'
            }`}
          >
            <span className="text-2xl">{habit.emoji}</span>
            <span className="text-xs text-textSecondary text-center leading-tight">{habit.name}</span>
          </motion.button>
        ))}
      </div>

      {isCustom && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-accent/50 p-4 space-y-3"
        >
          <h3 className="text-sm font-semibold text-textPrimary">Custom Habit</h3>
          <Input
            placeholder="Enter habit name..."
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            autoFocus
          />
          <div>
            <label className="block text-xs text-textMuted mb-2">Pick an emoji</label>
            <div className="grid grid-cols-10 gap-1.5">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setCustomEmoji(e)}
                  className={`text-lg p-1.5 rounded-lg transition-all ${customEmoji === e ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-surfaceHover'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={() => navigate('/')} className="flex-1">Cancel</Button>
        <Button
          onClick={handleAdd}
          loading={mutation.isPending}
          disabled={!selected && !(isCustom && customName.trim())}
          className="flex-1"
        >
          Add Habit
        </Button>
      </div>
    </div>
  );
};
