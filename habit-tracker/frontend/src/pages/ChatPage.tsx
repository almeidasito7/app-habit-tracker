import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../services/api';
import { useChatStore } from '../store/chatStore';
import { useHabitsStore } from '../store/habitsStore';

export const ChatPage: React.FC = () => {
  const { messages, addMessage, setLoading, isLoading, clearMessages } = useChatStore();
  const { habits, todayStats } = useHabitsStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: ({ message }: { message: string }) => {
      const context = {
        habits: habits.map(h => h.name),
        streak: Math.max(...habits.map(h => h.currentStreak), 0),
      };
      return aiApi.chat(message, context as Record<string, unknown>);
    },
    onSuccess: (data) => {
      addMessage({ role: 'assistant', content: data.message });
      setLoading(false);
    },
    onError: () => {
      addMessage({ role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' });
      setLoading(false);
    },
  });

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput('');
    addMessage({ role: 'user', content: message });
    setLoading(true);
    sendMutation.mutate({ message });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const QUICK_PROMPTS = [
    '📊 Analyze my habits',
    '💡 Suggest new habits',
    '📅 Create my schedule',
    '🎯 Help with my goals',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-textPrimary">AI Coach</h2>
          <p className="text-xs text-textMuted">Powered by GPT-4</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="p-2 rounded-xl hover:bg-surface text-textMuted hover:text-error transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-accent" size={28} />
            </div>
            <h3 className="text-textPrimary font-semibold mb-2">Your AI Habit Coach</h3>
            <p className="text-textMuted text-sm mb-6">Ask me anything about habits, goals, or schedules</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt.slice(2)); }}
                  className="bg-surface border border-border rounded-xl p-3 text-sm text-textSecondary hover:border-accent/50 hover:text-textPrimary transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
                  message.role === 'user' ? 'bg-accent' : 'bg-surface border border-border'
                }`}>
                  {message.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-accent" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-accent text-white rounded-tr-none'
                    : 'bg-surface border border-border text-textPrimary rounded-tl-none'
                }`}>
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-surface border border-border flex items-center justify-center">
              <Bot size={14} className="text-accent" />
            </div>
            <div className="bg-surface border border-border rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-textMuted rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 pt-3 border-t border-border">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI coach..."
          rows={1}
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted focus:outline-none focus:border-accent transition-colors resize-none text-sm"
          style={{ maxHeight: '100px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="bg-accent hover:bg-accentHover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 transition-colors flex items-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
