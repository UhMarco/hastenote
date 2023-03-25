"use client";

import { useExplorer } from "@/components/ExplorerProvider";
import { useSupabase } from "@/components/supabaseProvider";
import { useEffect, useRef, useState } from "react";
import ContextMenu, { ContextMenuField, ContextMenuPosition } from "./ContextMenu";
import Note from "./Note";

export type Folder = {
  folder_id?: string;
  folder_name: string;
  owner_id: string;
  created_at?: string;
  parent_id: string | null;
};

/**
 * Folder component for sidebar explorer.
 */
export default function Folder({ folder }: { folder: Folder; }) {
  const { supabase } = useSupabase();

  const explorer = useExplorer();
  const { folders: explorerFolders, notes: explorerNotes } = explorer;

  const [open, setOpen] = useState(false);

  const [folders, setFolders] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  // Right click related states.
  const [menu, setMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });

  const [renaming, setRenaming] = useState(false);
  const [renamed, setRenamed] = useState(folder.folder_name);

  const menuRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Disable default right click and show custom menu.
  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setMenu(true);
    setMenuPosition({ x: e.pageX, y: e.pageY });
  };

  // Close menu on mouse down.
  useEffect(() => {
    const mouseDownHandler = (e: MouseEvent) => {
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
        .from("folders")
        .update({ folder_name: renamed })
        .eq("folder_id", folder.folder_id);
      setRenaming(false);
      // Updating the folder name locally isn't needed, but it makes it look like its updated faster.
      folder.folder_name = renamed;
      explorer.refresh();
    }
  };

  // Get children.
  useEffect(() => {
    const update = async () => {
      setFolders(explorerFolders.filter(e => e.parent_id === folder.folder_id));
      setNotes(explorerNotes.filter(e => e.parent_id === folder.folder_id));
    };
    update();
  }, [explorerFolders, explorerNotes, folder.folder_id]);

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onClick={() => setOpen(o => !o)}
        className="flex flex-shrink-0 items-center cursor-pointer pr-4 hover:text-text-xlight"
      >
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
        {!renaming
          ? <p className="h-6 leading-6">{folder.folder_name}</p>
          : <input ref={inputRef} autoFocus onKeyDown={handleSubmit} className="h-6 leading-6 outline-none ring-none border-[1px] border-gray-700 text-text-light bg-bg-default px-2" value={renamed} onChange={(e) => setRenamed(e.target.value)}></input>
        }
      </div>
      {menu && <ContextMenu menuRef={menuRef} position={menuPosition} onClose={() => setMenu(false)} fields={[{
        name: "Rename",
        method: () => {
          setRenaming(true);
          setRenamed(folder.folder_name);
        }
      },
      ...(explorer.folders.filter(f => f.folder_id !== folder.parent_id && f.folder_id !== folder.folder_id).length || folder.parent_id ? [{
        name: "Move",
        subitems: [...(folder.parent_id ? [{
          name: "Root",
          method: async () => {
            await supabase
              .from("folders")
              .update({ parent_id: null })
              .eq("folder_id", folder.folder_id);
            explorer.refresh();
          }
        }] : []),
        ...explorer.folders.filter(newParentFolder => newParentFolder.folder_id !== folder.parent_id && newParentFolder.folder_id !== folder.folder_id).map<ContextMenuField>((newParentFolder) => {
          return {
            name: newParentFolder.folder_name,
            method: async () => {
              // Make sure folders are not about to be set as parents of each other.
              if (newParentFolder.parent_id === folder.folder_id) {
                await supabase
                  .from("folders")
                  .update({ parent_id: folder.parent_id })
                  .eq("folder_id", newParentFolder.folder_id);
              }
              await supabase
                .from("folders")
                .update({ parent_id: newParentFolder.folder_id })
                .eq("folder_id", folder.folder_id);
              explorer.refresh();
            }
          };
        })],
        method: () => null
      }] : []),
      {
        name: "Delete", method: async () => {
          // Move stored notes.
          await supabase
            .from("notes_v2")
            .update({ parent_id: folder.parent_id })
            .eq("parent_id", folder.folder_id);
          // Move stored folders
          await supabase
            .from("folders")
            .update({ parent_id: folder.parent_id })
            .eq("parent_id", folder.folder_id);
          // Delete folder
          await supabase
            .from("folders")
            .delete()
            .eq("folder_id", folder.folder_id);
          explorer.refresh();
        }
      }]} />}
      {/* Children */}
      {open && <div className="ml-2">
        {folders.map(folder => <Folder key={folder.folder_id} folder={folder} />)}
        {notes.map(note => <Note key={note.note_id} note={note} />)}
      </div>}
    </>
  );
}