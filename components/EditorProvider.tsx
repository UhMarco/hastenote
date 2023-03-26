"use client";

import { Note } from "./Sidebar/Explorer/Note";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { HastenoteUser, useSupabase } from "./supabaseProvider";
import { usePathname, useRouter } from "next/navigation";
import { generate } from "randomstring";
import { PostgrestSingleResponse } from "@supabase/supabase-js";


type EditorContext = {
  content: string,
  note: Note | undefined,
  previousNote: Note | undefined,
  setNote: (note: Note) => Promise<Note>,
  newNote: (user?: HastenoteUser, set?: boolean) => Promise<Note>,
  updateContent: (value: string) => void,
  save: (value: string, id?: string) => void,
  clear: () => void;
};

const Context = createContext<EditorContext | undefined>(undefined);

/**
 * Custom editor hook.
 * Stores current content, note and state.
 */
export default function EditorProvider({ children }: { children: ReactNode; }) {
  const { supabase } = useSupabase();

  const router = useRouter();
  const path = usePathname();

  const [note, setNoteState] = useState<Note>();
  const [previousNote, setPreviousNote] = useState<Note>();
  const [content, setContent] = useState<string>("");

  let updatedNote: Note;

  // Handle setting a new active note.
  const setNote = async (newNote: Note) => {
    // Check for content updates since last render.
    if (note?.note_id) {
      let { data }: PostgrestSingleResponse<Note> = await supabase
        .from("notes_v2")
        .select("*")
        .eq("note_id", newNote.note_id)
        .single();

      updatedNote = data || newNote;
    } else updatedNote = newNote;

    // Set editor content.
    setContent(updatedNote.content);

    // Move back to notes if looking at a public note.
    if (path !== "/notes") router.push("/notes");

    // Set the state.
    setPreviousNote(note);
    setNoteState(updatedNote as Note);

    // Return the new data just in case the location this method has been called from is using outdata info.
    return updatedNote as Note;
  };

  // Create a new empty note.
  const newNote = async (user?: HastenoteUser, set: boolean = true) => {
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
    if (set) setNote(newNote);
    return newNote as Note;
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

  // Update content
  const updateContent = (newContent: string) => {
    setContent(newContent);
    if (note) note.content = newContent;
  };

  // Save content
  const save = useCallback(async (value: string, id?: string) => {
    if (!note) return;
    await supabase.from("notes_v2").update({ content: value }).eq("note_id", id || note?.note_id);
  }, [supabase, note]);

  // Clear content
  const clear = () => {
    setContent("");
    setPreviousNote(note);
    setNoteState(undefined);
  };

  return (
    <Context.Provider value={{ content, note, previousNote, setNote, newNote, updateContent, save, clear }}>
      {children}
    </Context.Provider>
  );
}

// Function returning access to context.
export const useEditor = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useEditor must be used inside EditorProvider");
  } else {
    return context;
  }
};