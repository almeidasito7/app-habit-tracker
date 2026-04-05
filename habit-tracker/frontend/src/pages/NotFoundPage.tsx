import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl mb-4">🌌</div>
        <h1 className="text-4xl font-black text-textPrimary mb-2">404</h1>
        <p className="text-textMuted mb-6">Oops! This page got lost in the void.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </motion.div>
    </div>
  );
};
