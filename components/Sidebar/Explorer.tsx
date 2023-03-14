"use client";

import { useSupabase } from "../supabase-provider";
import Folder, { Folder as FolderType } from "./Explorer/Folder";
import Note, { Note as NoteType } from "./Explorer/Note";

export default function Explorer({ folders, notes }: { folders: FolderType[], notes: NoteType[]; }) {
  const { user } = useSupabase();

  const newNote = () => {

  };

  const newFolder = () => {

  };

  return (
    <div className="flex flex-col pt-4 pl-1 pr-3 text-xs select-none h-full overflow-auto text-text-medium stroke-text-light group">
      <div className="flex box-border items-center pl-2 mb-2 h-6 overflow-hidden">
        <h1 className="text-text-light overflow-hidden overflow-ellipsis">{user?.username}{"'"}s notes</h1>

        <div className="group-hover:flex hidden ml-auto flex-initial">
          <div onClick={() => newNote()} className="cursor-pointer hover:bg-gray-700/50 rounded-md p-1">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div onClick={() => newFolder()} className="cursor-pointer hover:bg-gray-700/50 rounded-md p-1">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Items */}
      {folders.map(folder => <Folder key={folder.folder_id} folder={folder} />)}
      {notes.map(note => <Note key={note.note_id} note={note} />)}
    </div>
  );
}