"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { useEditor } from "./EditorProvider";
import { Folder } from "./Sidebar/Explorer/Folder";
import { Note } from "./Sidebar/Explorer/Note";
import { useSupabase } from "./supabaseProvider";

type ExplorerContext = {
  folders: Folder[],
  notes: Note[],
  refresh: () => void,
  newNote: (set?: boolean) => void,
  newFolder: () => void,
};

const Context = createContext<ExplorerContext | undefined>(undefined);

export default function ExplorerProvider({ children }: { children: ReactNode; }) {
  const { supabase, user } = useSupabase();

  const editor = useEditor();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;

    // Folders
    const { data: f } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user!.id)
      .order("folder_name");
    if (f) setFolders(f as Folder[]);

    // Notes
    const { data: n } = await supabase
      .from("notes_v2")
      .select("*")
      .eq("owner_id", user!.id)
      .order("note_name");
    if (n) setNotes(n as Note[]);
  }, [supabase, user]);

  const newNote = async (set: boolean = false) => {
    const note = await editor.newNote(user || undefined);
    delete note.note_id, note.created_at; // Database will make these for me.
    const { data } = await supabase
      .from("notes_v2")
      .insert(note)
      .select()
      .single();
    if (set) editor.setNote(data! as Note);
    refresh();
  };

  const newFolder = async () => {
    await supabase
      .from("folders")
      .insert({
        folder_name: "Unnamed Folder",
        owner_id: user!.id
      })
      .select()
      .single();
    refresh();
  };

  return (
    <Context.Provider value={{ folders, notes, refresh, newNote, newFolder }}>
      {children}
    </Context.Provider>
  );
}

export const useExplorer = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useEditor must be used inside NoteProvider");
  } else {
    return context;
  }
};
