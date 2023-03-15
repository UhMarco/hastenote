"use client";

import { useNote } from "@/components/NoteProvider";

export type Note = {
  content: string;
  created_at?: string;
  note_id?: string;
  note_name: string;
  owner_id: string | null;
  parent_id: string | null;
  private: boolean;
  slug: string;
};

/**
 * Note component for sidebar explorer.
 */
export default function Note({ note }: { note: Note; }) {
  const activeNote = useNote();

  return (
    <div onClick={() => activeNote.setNote(note)} className={`-ml-2 pl-2 flex flex-shrink-0 items-center cursor-pointer pr-4 hover:text-text-xlight${activeNote.note?.note_id === note.note_id ? " bg-white/5 bg-cover" : ""}`}>
      <svg className="w-4 h-4 flex-shrink-0 ml-[18px] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
      <p className="h-6 leading-6">{note.note_name}</p>
    </div>
  );
}