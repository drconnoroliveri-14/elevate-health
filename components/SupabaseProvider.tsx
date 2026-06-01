"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/supabase-js";

interface SupabaseContextValue {
  session: Session | null;
}

const SupabaseContext = createContext<SupabaseContextValue>({ session: null });

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const supabase = createBrowserClient(url, key);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => { setSession(newSession); });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseSession() {
  return useContext(SupabaseContext);
}
