import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { plansApi } from '../services/api';
import { Plan } from '../types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const planIcons = { free: Star, pro: Zap, premium: Crown };

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: plans = [] } = useQuery<Plan[]>({ queryKey: ['plans'], queryFn: plansApi.getAll });

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'free') return;
    navigate('/payment', { state: { plan } });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-black text-textPrimary">Choose Your Plan</h2>
        <p className="text-textMuted text-sm mt-1">Unlock your full potential</p>
      </div>

      <div className="space-y-3">
        {plans.map((plan, idx) => {
          const Icon = planIcons[plan.id as keyof typeof planIcons] || Star;
          const isCurrentPlan = user?.plan === plan.id;
          const isFeatured = plan.id === 'pro';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-2xl border p-5 ${
                isFeatured
                  ? 'border-accent bg-gradient-to-br from-accent/10 to-surface'
                  : 'border-border bg-surface'
              }`}
            >
              {isFeatured && (
                <div className="text-center mb-3">
                  <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFeatured ? 'bg-accent/20' : 'bg-surface border border-border'}`}>
                    <Icon size={20} className={isFeatured ? 'text-accent' : 'text-textSecondary'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-textPrimary">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-textPrimary">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </span>
                      {plan.price > 0 && <span className="text-textMuted text-sm">/{plan.interval}</span>}
                    </div>
                  </div>
                </div>
                {isCurrentPlan && (
                  <span className="bg-success/20 text-success text-xs font-semibold px-2 py-1 rounded-full">Current</span>
                )}
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-sm text-textSecondary">
                    <Check size={14} className="text-success flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={isFeatured ? 'primary' : 'secondary'}
                className="w-full"
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrentPlan || plan.id === 'free'}
              >
                {isCurrentPlan ? 'Current Plan' : plan.id === 'free' ? 'Free Forever' : `Get ${plan.name}`}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
