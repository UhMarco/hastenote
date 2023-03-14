"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNote } from "./NoteProvider";
import { useSupabase } from "./supabase-provider";

export default function SupabaseListener({ serverAccessToken }: { serverAccessToken: string | undefined; }) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const activeNote = useNote();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Refresh the routes.
      if (session?.access_token !== serverAccessToken) router.refresh();
      // Clear the current note.
      activeNote.clear();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, router, supabase, activeNote]);

  // Don't render anything.
  return null;
}
