"use client";

import { useEditor } from "@/components/EditorProvider";
import { useExplorer } from "@/components/ExplorerProvider";
import { useSupabase } from "@/components/supabaseProvider";
import { useEffect, useRef, useState } from "react";
import ContextMenu, { ContextMenuField, ContextMenuPosition } from "./ContextMenu";
import Notification from "@/components/Notification";

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
  const { supabase } = useSupabase();
  const explorer = useExplorer();

  // const activeNote = useNote();
  const editor = useEditor();

  // Right click related states.
  const [menu, setMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });

  const [renaming, setRenaming] = useState(false);
  const [renamed, setRenamed] = useState(note.note_name);

  const menuRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [notificationMessage, setNotificationMessage] = useState<string | undefined>();

  const notificationRef = useRef<HTMLDivElement>(null);

  // Disable default right click and show custom menu.
  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setMenu(true);
    setMenuPosition({ x: e.pageX, y: e.pageY });
  };

  // Close menu on mouse down.
  useEffect(() => {
    const mouseDownHandler = (e: MouseEvent) => {
      if (notificationMessage && !notificationRef.current?.contains(e.target as Element)) setNotificationMessage(undefined);
      if (e.target !== inputRef.current && renaming) setRenaming(false);
      if (e.target === menuRef.current || menuRef.current?.contains(e.target as Element)) return;
      if (menu) setMenu(false);
    };
    document.addEventListener("mousedown", mouseDownHandler);

    const keyListener = (e: KeyboardEvent) => { if (menu && e.key === "Escape") setMenu(false); };
    document.addEventListener("keydown", keyListener);

    return () => {
      document.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("keydown", keyListener);
    };
  });

  // Handle submitting new name.
  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!renaming) return;
    if (e.key === "Escape") return setRenaming(false);
    if (e.key === "Enter") {
      await supabase
        .from("notes_v2")
        .update({ note_name: renamed })
        .eq("note_id", note.note_id);
      setRenaming(false);
      note.note_name = renamed;
      explorer.refresh();
    }
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onClick={() => { if (!renaming) editor.setNote(note); }}
        className={`-ml-2 pl-2 cursor-pointer flex flex-shrink-0 items-center pr-4 hover:text-text-xlight${editor.note?.note_id === note.note_id ? " bg-white/5 bg-cover" : ""}${menu ? " text-text-xlight" : ""}`}
      >
        <svg className="w-4 h-4 flex-shrink-0 ml-[18px] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        {!renaming
          ? <p className="h-6 leading-6">{note.note_name}</p>
          : <input ref={inputRef} autoFocus onKeyDown={handleSubmit} className="h-6 leading-6 outline-none ring-none border-[1px] border-gray-700 text-text-light bg-bg-default px-2" value={renamed} onChange={(e) => setRenamed(e.target.value)}></input>
        }
      </div>
      <Notification notificationRef={notificationRef} visible={notificationMessage != undefined} onClose={() => setNotificationMessage(undefined)} message={notificationMessage!} />
      {menu && <ContextMenu menuRef={menuRef} position={menuPosition} onClose={() => setMenu(false)} fields={[{
        name: "Rename",
        method: () => {
          setRenaming(true);
          setRenamed(note.note_name);
        }
      },
      ...(explorer.folders.length ? [{
        name: "Move",
        subitems: [...(note.parent_id ? [{
          name: "Root",
          method: async () => {
            await supabase
              .from("notes_v2")
              .update({ parent_id: null })
              .eq("note_id", note.note_id);
            explorer.refresh();
          }
        }] : []),
        ...explorer.folders.filter(folder => folder.folder_id !== note.parent_id).map<ContextMenuField>((folder) => {
          return {
            name: folder.folder_name,
            method: async () => {
              await supabase
                .from("notes_v2")
                .update({ parent_id: folder.folder_id })
                .eq("note_id", note.note_id);
              explorer.refresh();
            }
          };
        })],
        method: () => null
      }] : []),
      {
        name: "Duplicate", method: async () => {
          const clone = { ...note };
          delete clone.note_id, clone.created_at;
          clone.note_name = clone.note_name + " Copy";
          await supabase
            .from("notes_v2")
            .insert(clone);
          explorer.refresh();
        }
      },
      {
        name: "Delete", method: async () => {
          await supabase
            .from("notes_v2")
            .delete()
            .eq("note_id", note.note_id);
          if (editor.note?.note_id === note.note_id) editor.clear();
          explorer.refresh();
        }
      },
      ...(note.private ? [{
        name: "Share",
        method: async () => {
          await supabase
            .from("notes_v2")
            .update({ private: false })
            .eq("note_id", note.note_id);
          note.private = false;
          navigator.clipboard.writeText(`https://hastenote.com/${note.slug}`);
          setNotificationMessage("Link copied to clipboard.");
        }
      }] : [
        {
          name: "Copy Link",
          method: () => {
            navigator.clipboard.writeText(`https://hastenote.com/${note.slug}`);
            setNotificationMessage("Link copied to clipboard.");
          }
        },
        {
          name: "Make Private",
          method: async () => {
            await supabase
              .from("notes_v2")
              .update({ private: true })
              .eq("note_id", note.note_id);
            note.private = true;
            setNotificationMessage("Note set to private.");
          }
        }])]} />}
    </>
  );
}