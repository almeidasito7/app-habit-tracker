import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Flame } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authService } from '../services/supabase';
import { useAuthStore } from '../store/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { session } = await authService.signUp(email, password, fullName);
      if (session) {
        login({ id: session.user.id, plan: 'free', fullName, createdAt: '', updatedAt: '' }, session.access_token);
        navigate('/');
      } else {
        setError('Please check your email to confirm your account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="bg-accent/20 rounded-2xl p-3">
              <Flame className="text-accent" size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-textPrimary">Start your journey</h1>
          <p className="text-textMuted mt-1">Build better habits with AI</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
          {error && (
            <div className="bg-error/10 border border-error/30 rounded-xl p-3 mb-4 text-error text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" type="text" placeholder="John Doe" value={fullName}
              onChange={e => setFullName(e.target.value)} icon={<User size={16} />} />
            <Input label="Email" type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} icon={<Mail size={16} />} required />
            <Input label="Password" type="password" placeholder="Min 6 characters" value={password}
              onChange={e => setPassword(e.target.value)} icon={<Lock size={16} />} required />
            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">Create Account</Button>
          </form>
        </div>
        <p className="text-center text-textMuted text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accentHover font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};
