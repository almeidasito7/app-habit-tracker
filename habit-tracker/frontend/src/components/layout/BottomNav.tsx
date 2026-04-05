import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, TreePine, CalendarDays, Plus } from 'lucide-react';
import { cn } from '../../utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/agenda', icon: CalendarDays, label: 'Agenda' },
  { to: '/habit-adder', icon: Plus, label: 'Add', special: true },
  { to: '/chat', icon: MessageCircle, label: 'AI Chat' },
  { to: '/ability-tree', icon: TreePine, label: 'Tree' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-t border-border">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map(({ to, icon: Icon, label, special }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 transition-all duration-200',
                special
                  ? 'bg-accent rounded-2xl p-3 -mt-6 shadow-lg shadow-accent/30 hover:bg-accentHover'
                  : cn(
                      'text-xs px-3 py-2 rounded-xl',
                      isActive ? 'text-accent' : 'text-textMuted hover:text-textSecondary'
                    )
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={special ? 22 : 20} className={special ? 'text-white' : ''} />
                {!special && <span className={cn('text-xs', isActive ? 'text-accent' : '')}>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
