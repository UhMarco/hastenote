"use client";

import { createContext, useContext, useState } from "react";
import { createClient } from "../utils/supabase-browser";

import type { Session, SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type HastenoteUser = {
  id: string;
  username: string;
  pro: boolean;
};

type SupabaseContext = {
  supabase: SupabaseClient;
  session: Session | null;
  user: HastenoteUser | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({ children, session, user }: { children: React.ReactNode, session: Session | null, user: HastenoteUser | null; }) {
  const [supabase] = useState(() => createClient());

  return (
    <Context.Provider value={{ supabase, session, user }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  } else {
    return context;
  }
};
