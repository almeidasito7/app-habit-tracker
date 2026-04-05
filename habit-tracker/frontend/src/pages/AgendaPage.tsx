import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { habitsApi, aiApi } from '../services/api';
import { HabitWithStreak } from '../types';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AgendaPage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [aiSchedule, setAiSchedule] = useState<{ time: string; activity: string; duration: number }[]>([]);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: habits = [] } = useQuery<HabitWithStreak[]>({
    queryKey: ['habits'],
    queryFn: habitsApi.getAll,
  });

  const scheduleMutation = useMutation({
    mutationFn: () => aiApi.generateSchedule(
      habits.map(h => `${h.emoji} ${h.name}`),
      { preferMorning: true, workHours: '9-17' }
    ),
    onSuccess: (data) => setAiSchedule(data),
  });

  const today = new Date();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-textPrimary">Agenda</h2>
        <p className="text-textMuted text-sm">Weekly habit schedule</p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentWeek(subDays(currentWeek, 7))} className="p-2 rounded-xl hover:bg-surface text-textMuted hover:text-textPrimary transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-textPrimary">
          {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </span>
        <button onClick={() => setCurrentWeek(addDays(currentWeek, 7))} className="p-2 rounded-xl hover:bg-surface text-textMuted hover:text-textPrimary transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          const dayHabits = habits.filter(h => h.recurrenceDays.includes(day.getDay() || 7));
          
          return (
            <div key={day.toISOString()} className={`flex flex-col items-center p-1.5 rounded-xl ${isToday ? 'bg-accent/10 border border-accent/30' : ''}`}>
              <span className="text-xs text-textMuted">{format(day, 'EEE')}</span>
              <span className={`text-sm font-bold mt-0.5 ${isToday ? 'text-accent' : 'text-textPrimary'}`}>
                {format(day, 'd')}
              </span>
              {dayHabits.length > 0 && (
                <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {dayHabits.slice(0, 2).map(h => (
                    <span key={h.id} className="text-[10px]">{h.emoji}</span>
                  ))}
                  {dayHabits.length > 2 && <span className="text-[9px] text-textMuted">+{dayHabits.length - 2}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Today's Habits */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider">Today's Schedule</h3>
        </CardHeader>
        <CardContent>
          {habits.filter(h => h.recurrenceDays.includes(today.getDay() || 7)).length === 0 ? (
            <p className="text-textMuted text-sm text-center py-4">No habits scheduled for today</p>
          ) : (
            <div className="space-y-2">
              {habits.filter(h => h.recurrenceDays.includes(today.getDay() || 7)).map((habit) => (
                <div key={habit.id} className="flex items-center gap-3 p-2 rounded-xl bg-background">
                  <span className="text-xl">{habit.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-textPrimary">{habit.name}</p>
                    <p className="text-xs text-textMuted capitalize">{habit.category}</p>
                  </div>
                  {habit.completedToday && (
                    <span className="text-success text-xs font-semibold">Done ✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider">AI Schedule</h3>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => scheduleMutation.mutate()}
              loading={scheduleMutation.isPending}
            >
              <Sparkles size={14} />
              Generate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiSchedule.length === 0 ? (
            <p className="text-textMuted text-sm text-center py-4">
              Generate an AI-optimized daily schedule based on your habits
            </p>
          ) : (
            <div className="space-y-2">
              {aiSchedule.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-xl bg-background"
                >
                  <span className="text-xs font-bold text-accent w-12">{item.time}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-textPrimary">{item.activity}</p>
                  </div>
                  <span className="text-xs text-textMuted">{item.duration}min</span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
