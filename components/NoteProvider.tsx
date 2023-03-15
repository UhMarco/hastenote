"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Note } from "./Sidebar/Explorer/Note";
import { HastenoteUser, useSupabase } from "./supabase-provider";
import { generate } from "randomstring";

type MaybeNote = Note | undefined;

type NoteContext = {
  note: MaybeNote,
  setNote: (note: Note) => Promise<Note>,
  newNote: (user?: HastenoteUser, set?: boolean) => Promise<Note>,
  newSlug: () => Promise<string>,
  clear: () => void;
};

const Context = createContext<NoteContext | undefined>(undefined);

/**
 * Custom active note hook.
 * Stores useful content and note related helper methods.
 */
export default function NoteProvider({ children }: { children: ReactNode; }) {
  const [note, setNoteState] = useState<MaybeNote>();

  const { supabase } = useSupabase();

  // Set the note state
  const setNote = async (note: Note): Promise<Note> => {
    // Check for content updates since last render.
    const { data: updatedNote } = await supabase
      .from("notes_v2")
      .select("*")
      .eq("note_id", note.note_id)
      .single();
    const newNote: Note = updatedNote as Note || note;
    setNoteState(newNote);
    // Return the new data just in case the location this method has been called from is using outdata info.
    return newNote;
  };

  // Create a new empty note.
  const newNote = async (user?: HastenoteUser, set: boolean = true): Promise<Note> => {
    const newNote = {
      content: "",
      created_at: undefined, // This will be written by backend when uploaded.
      note_id: undefined, // Same ^
      note_name: "Unnamed Note",
      owner_id: user?.id || null,
      parent_id: null,
      private: !!user,
      slug: await newSlug()
    };
    if (set) setNoteState(newNote);
    return newNote;
  };

  // Create a unique slug.
  const newSlug = async (): Promise<string> => {
    let slug;
    while (true) {
      slug = generate(10);
      const { data } = await supabase
        .from("notes_v2")
        .select("slug")
        .eq("slug", slug);
      if (!data!.length) break;
    }
    return slug;
  };

  // Clear the currently active note.
  const clear = (): void => setNoteState(undefined);

  return (
    <Context.Provider value={{ note, setNote, newNote, newSlug, clear }}>
      {children}
    </Context.Provider>
  );
}

// Function returning access to context.
export const useNote = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useNote must be used inside NoteProvider");
  } else {
    return context;
  }
};