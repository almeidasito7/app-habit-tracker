import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/supabase';
import { profileApi } from '../services/api';

export const useAuth = () => {
  const { login, logout, isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          login({ id: session.user.id, plan: 'free', createdAt: '', updatedAt: '' }, session.access_token);
          try {
            const userData = await profileApi.get();
            login(userData, session.access_token);
          } catch { /* non-critical */ }
        }
      } catch { /* ignore */ }
    };

    if (!isAuthenticated) {
      checkSession();
    }

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event: string, session: unknown) => {
      const s = session as { access_token: string; user: { id: string } } | null;
      if (event === 'SIGNED_IN' && s) {
        login({ id: s.user.id, plan: 'free', createdAt: '', updatedAt: '' }, s.access_token);
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAuthenticated, user, token };
};
