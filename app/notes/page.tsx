"use client";

import Editor from "@/components/Editor";
import Logo from "@/public/logo.svg";
import { useNote } from "@/components/NoteProvider";

export default function Notes() {
  const activeNote = useNote();

  return (
    <>
      {activeNote.note
        ? <Editor content={activeNote.note.content} slug={activeNote.note.slug} />
        :
        <div className="w-full h-full flex flex-col justify-center items-center select-none space-y-5">
          <Logo className="fill-black/5 w-64 h-64" />
          <div className="text-black/10">Create a note</div>
        </div>
      }
    </>
  );
}
