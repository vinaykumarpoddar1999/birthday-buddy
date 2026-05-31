import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';
import {
  clearAuthTokens,
  setAccessToken,
  setRefreshToken,
} from '@/lib/secure-storage';
import { logger } from '@services/logging';
import { useAuthStore } from '@store/auth.store';

export function useAppInitialization() {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    let mounted = true;

    async function hydrateSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
          });
          if (session.access_token) await setAccessToken(session.access_token);
          if (session.refresh_token) await setRefreshToken(session.refresh_token);
        }
      } catch (error) {
        logger.error('auth.hydrate.failed', { error: String(error) });
      } finally {
        if (mounted) setHydrated(true);
      }
    }

    hydrateSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
        });
        if (session.access_token) await setAccessToken(session.access_token);
        if (session.refresh_token) await setRefreshToken(session.refresh_token);
      } else {
        useAuthStore.getState().signOut();
        await clearAuthTokens();
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setHydrated, setUser]);
}
