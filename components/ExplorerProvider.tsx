"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { useNote } from "./NoteProvider";
import { Folder } from "./Sidebar/Explorer/Folder";
import { Note } from "./Sidebar/Explorer/Note";
import { useSupabase } from "./supabase-provider";

type ExplorerContext = {
  folders: Folder[],
  rootFolders: Folder[],
  notes: Note[],
  notesAt: (id: string) => Promise<Note[]>,
  foldersAt: (id: string) => Promise<Folder[]>,
  refresh: () => void,
  newNote: () => void,
  newFolder: () => void,
};

const Context = createContext<ExplorerContext | undefined>(undefined);

export default function ExplorerProvider({ children }: { children: ReactNode; }) {
  const { supabase, user } = useSupabase();

  const activeNote = useNote();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [rootFolders, setRootFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const refresh = useCallback(async () => {
    // Folders
    const { data: f } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user!.id)
      .order("folder_name");
    if (f) setFolders(f as Folder[]);

    // Root Folders
    const { data: rf } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user!.id)
      .is("parent_id", null)
      .order("folder_name");
    if (rf) setRootFolders(rf as Folder[]);

    // Notes
    const { data: n } = await supabase
      .from("notes_v2")
      .select("*")
      .eq("owner_id", user!.id)
      .is("parent_id", null)
      .order("note_name");
    if (n) setNotes(n as Note[]);
  }, [supabase, user]);

  const notesAt = async (id: string) => {
    const { data } = await supabase
      .from("notes_v2")
      .select("*")
      .eq("owner_id", user!.id)
      .eq("parent_id", id)
      .order("note_name");
    return data as Note[];
  };

  const foldersAt = async (id: string) => {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user!.id)
      .eq("parent_id", id)
      .order("folder_name");
    return data as Folder[];
  };

  const newNote = async () => {
    const note = await activeNote.newNote(user!, false);
    delete note.note_id, note.created_at; // Database will make these for me.
    await supabase
      .from("notes_v2")
      .insert(note)
      .select()
      .single();
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
    <Context.Provider value={{ folders, rootFolders, notes, notesAt, foldersAt, refresh, newNote, newFolder }}>
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
