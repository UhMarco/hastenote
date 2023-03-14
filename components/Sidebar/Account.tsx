"use client";

import Link from "next/link";
import { useSupabase } from "../supabase-provider";

export default function Account() {
  const { supabase, session, user } = useSupabase();

  return (
    <div className="flex flex-col pt-4 pl-1 pr-3 text-xs select-none h-full overflow-auto text-text-medium">
      <div className="flex box-border items-center pl-2 mb-2 h-6 overflow-hidden">
        <h1 className="text-text-light overflow-hidden overflow-ellipsis">Account</h1>
      </div>
      <div className="mx-1 flex flex-col space-y-2 whitespace-normal">
        {session ?
          <>
            <p>You are signed in as {user?.username}</p>
            <button onClick={() => supabase.auth.signOut()} className="mt-2 flex items-center justify-center text-text-xlight bg-button-special outline-none rounded-md h-8 font-bold hover:bg-button-special/80">
              Sign out
            </button>
          </>
          :
          <>
            <p>You are not currently signed in.</p>
            <Link href="/signin" className="mt-2 flex items-center justify-center text-text-xlight bg-button-special outline-none rounded-md h-8 font-bold hover:bg-button-special/80">
              Sign in
            </Link>
          </>
        }
      </div>
    </div>
  );
}
