import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { plansApi } from '../services/api';
import { Plan } from '../types';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan as Plan | undefined;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!plan) {
    navigate('/plans');
    return null;
  }

  const handleCheckout = async () => {
    if (!plan.priceId) return;
    setLoading(true);
    setError('');
    try {
      const { url } = await plansApi.createCheckout(plan.priceId);
      if (url) window.location.href = url;
    } catch {
      setError('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/plans')} className="flex items-center gap-2 text-textMuted hover:text-textPrimary transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm">Back to plans</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-textPrimary">Complete Upgrade</h2>
        <p className="text-textMuted text-sm">Secure payment via Stripe</p>
      </motion.div>

      <div className="bg-surface rounded-2xl border border-accent/30 p-5">
        <h3 className="font-bold text-textPrimary mb-3">{plan.name} Plan</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-black text-textPrimary">${plan.price}</span>
          <span className="text-textMuted">/{plan.interval}</span>
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-textSecondary">
              <Check size={14} className="text-success" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-2 text-textSecondary">
          <Shield size={16} className="text-success" />
          <span className="text-sm">Secure payment powered by Stripe</span>
        </div>
        <p className="text-xs text-textMuted">
          You will be redirected to Stripe&apos;s secure checkout page to complete your payment.
          Your card details are handled securely by Stripe and never stored on our servers.
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 rounded-xl p-3 text-error text-sm">{error}</div>
      )}

      <Button onClick={handleCheckout} loading={loading} className="w-full" size="lg">
        Proceed to Payment – ${plan.price}/{plan.interval}
      </Button>

      <p className="text-center text-xs text-textMuted">
        Cancel anytime. No hidden fees.
      </p>
    </div>
  );
};
