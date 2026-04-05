import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { HabitCategory } from '../../types';

const EMOJIS = ['⭐', '💪', '📚', '🏃', '💧', '🌙', '📔', '💻', '🎯', '🥗', '🧘', '🎵', '🎨', '🧹', '🔥', '🌱'];
const CATEGORIES: { id: HabitCategory; label: string; emoji: string }[] = [
  { id: 'health', label: 'Health', emoji: '💪' },
  { id: 'learning', label: 'Learning', emoji: '📚' },
  { id: 'working', label: 'Work', emoji: '💼' },
  { id: 'fun', label: 'Fun', emoji: '🎮' },
  { id: 'evolution', label: 'Evolution', emoji: '🌱' },
  { id: 'others', label: 'Others', emoji: '⭐' },
];

interface HabitFormProps {
  onSubmit: (data: { name: string; emoji: string; category: HabitCategory; color: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, onCancel, loading }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [category, setCategory] = useState<HabitCategory>('others');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), emoji, category, color: '#f97316' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Habit Name"
        placeholder="e.g., Read for 30 minutes"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        autoFocus
      />
      <div>
        <label className="block text-sm font-medium text-textSecondary mb-2">Choose Emoji</label>
        <div className="grid grid-cols-8 gap-2">
          {EMOJIS.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`text-xl p-2 rounded-xl transition-all ${emoji === e ? 'bg-accent/20 ring-2 ring-accent' : 'bg-surface hover:bg-surfaceHover'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-textSecondary mb-2">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                category === cat.id ? 'bg-accent text-white' : 'bg-surface hover:bg-surfaceHover text-textSecondary'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">Add Habit</Button>
      </div>
    </form>
  );
};
