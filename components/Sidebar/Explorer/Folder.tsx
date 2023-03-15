"use client";

import { useSupabase } from "@/components/supabase-provider";
import { useEffect, useState } from "react";
import Note from "./Note";

export type Folder = {
  folder_id: string;
  folder_name: string;
  owner_id: string;
  parent_id: string | null;
};

/**
 * Folder component for sidebar explorer.
 */
export default function Folder({ folder }: { folder: Folder; }) {
  const { supabase, user } = useSupabase();

  const [open, setOpen] = useState(false);

  const [folders, setFolders] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const { data } = await supabase
        .from("folders")
        .select("*")
        .eq("owner_id", user!.id)
        .eq("parent_id", folder.folder_id)
        .order("folder_name");
      if (data) setFolders(data);
    };
    const fetchNotes = async () => {
      const { data } = await supabase
        .from("notes_v2")
        .select("*")
        .eq("owner_id", user!.id)
        .eq("parent_id", folder.folder_id)
        .order("note_name");
      if (data) setNotes(data);
    };
    fetchFolders();
    fetchNotes();
  }, [folder, supabase, user]);

  return (
    <>
      <div onClick={() => setOpen(o => !o)} className="flex flex-shrink-0 items-center cursor-pointer pr-4 hover:text-text-xlight">
        {open ?
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          :
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        }
        <svg className="w-4 h-4 ml-[2px] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
        <p className="h-6 leading-6">{folder.folder_name}</p>
      </div>
      {open && <div className="ml-2">
        {folders.map(folder => <Folder key={folder.folder_id} folder={folder} />)}
        {notes.map(note => <Note key={note.note_id} note={note} />)}
      </div>}
    </>
  );
}