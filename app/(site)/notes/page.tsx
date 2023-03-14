"use client";

import Editor from "@/components/Editor";
import Logo from "@/public/logo.svg";
import { useNote } from "@/components/NoteProvider";
import { useSupabase } from "@/components/supabase-provider";
import { useEffect } from "react";

export default function Notes() {
  const activeNote = useNote();
  const { user } = useSupabase();

  // If anonymous, create a new note to display.
  useEffect(() => {
    if (!user) {
      activeNote.newNote();
    }
  }, [user, activeNote]);

  return (
    <>
      {activeNote.note
        ? <Editor content={activeNote.note.content} slug={activeNote.note.slug} />
        :
        <div className="w-full h-full flex flex-col justify-center items-center select-none space-y-5">
          <Logo className="fill-black/5 w-64 h-64" />
        </div>
      }
    </>
  );
}
