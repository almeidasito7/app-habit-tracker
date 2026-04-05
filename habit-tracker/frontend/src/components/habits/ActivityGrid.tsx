import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { ActivityCell } from '../../types';
import { getCompletionColor } from '../../utils';
import { format, subDays } from 'date-fns';

interface ActivityGridProps {
  activity: ActivityCell[];
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({ activity }) => {
  const weeks = 8;
  const days = weeks * 7;
  
  // Pad to full weeks
  const paddedActivity: (ActivityCell | null)[] = [];
  const today = new Date();
  const startDayOfWeek = (today.getDay() + 1) % 7; // Make Monday first
  
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const cell = activity.find(a => a.date === date);
    paddedActivity.push(cell || { date, count: 0, intensity: 0 });
  }

  // Arrange into columns (weeks)
  const grid: (ActivityCell | null)[][] = [];
  for (let w = 0; w < weeks; w++) {
    grid.push(paddedActivity.slice(w * 7, (w + 1) * 7));
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider">Activity</h3>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-1">
            {dayLabels.map((label, i) => (
              <div key={i} className="w-3 h-3 flex items-center justify-center text-[9px] text-textMuted">
                {i % 2 === 0 ? label : ''}
              </div>
            ))}
          </div>
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className="w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 cursor-default"
                  style={{ backgroundColor: cell ? getCompletionColor(cell.intensity) : '#2a2a2a' }}
                  title={cell ? `${cell.date}: ${cell.count} habits` : ''}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs text-textMuted">Less</span>
          {([0, 1, 2, 3, 4] as const).map(i => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getCompletionColor(i) }} />
          ))}
          <span className="text-xs text-textMuted">More</span>
        </div>
      </CardContent>
    </Card>
  );
};
