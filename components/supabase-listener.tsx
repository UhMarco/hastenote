"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabase } from "./supabase-provider";

export default function SupabaseListener({ serverAccessToken }: { serverAccessToken: string | undefined; }) {
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Refresh the routes.
      if (session?.access_token !== serverAccessToken) router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, router, supabase]);

  // Don't render anything.
  return null;
}
