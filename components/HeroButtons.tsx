"use client";

import Link from "next/link";
import { useSupabase } from "./supabaseProvider";

export default function HeroButtons() {
  const { session } = useSupabase();

  return (
    <>
      {session
        ?
        <div className="mt-8">
          <p className="text-text-dark pb-4">You{"'"}re signed in.</p>
          <Link
            href="/notes"
            className="rounded-md bg-button-special px-3.5 py-2.5 text-sm font-semibold text-text-xlight shadow-sm hover:bg-button-special/80"
          >
            Let{"'"}s go
          </Link>
        </div>
        :
        <div className="mt-10 flex items-center gap-x-6">
          <Link
            href="/signin"
            className="rounded-md bg-button-special px-3.5 py-2.5 text-sm font-semibold text-text-xlight shadow-sm hover:bg-button-special/80"
          >
            Sign in
          </Link>
          <Link href="/notes" className="text-sm font-semibold leading-6 text-text-medium">
            Skip <span aria-hidden="true">→</span>
          </Link>
        </div>
      }
    </>
  );
}
