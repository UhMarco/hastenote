"use client";

import Editor from "@/components/Editor";
import Logo from "@/public/logo.svg";
import { useSupabase } from "@/components/supabaseProvider";
import { useRouter } from "next/navigation";
import { useEditor } from "@/components/EditorProvider";
import { useExplorer } from "@/components/ExplorerProvider";

export default function Notes() {
  const { user } = useSupabase();
  const editor = useEditor();
  const explorer = useExplorer();
  const router = useRouter();

  const newNote = () => {
    explorer.newNote(true);
  };

  return (
    <>
      {editor.note
        ? <Editor />
        :
        <div className="w-full h-full flex flex-col justify-center items-center select-none space-y-5">
          <Logo className="fill-black/20 w-64 h-64" />
          <div className="flex text-text-dark space-x-2 hover:bg-white/5 p-2 -mx-2 rounded-md" onClick={newNote}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M6 3a3 3 0 00-3 3v2.25a3 3 0 003 3h2.25a3 3 0 003-3V6a3 3 0 00-3-3H6zM15.75 3a3 3 0 00-3 3v2.25a3 3 0 003 3H18a3 3 0 003-3V6a3 3 0 00-3-3h-2.25zM6 12.75a3 3 0 00-3 3V18a3 3 0 003 3h2.25a3 3 0 003-3v-2.25a3 3 0 00-3-3H6zM17.625 13.5a.75.75 0 00-1.5 0v2.625H13.5a.75.75 0 000 1.5h2.625v2.625a.75.75 0 001.5 0v-2.625h2.625a.75.75 0 000-1.5h-2.625V13.5z" />
            </svg>
            <div className="font-semibold">{`Create a${!user ? "n anonymous" : " new"} note`}</div>
          </div>
          {!user && <div className="flex text-text-dark space-x-2 hover:bg-white/5 p-2 -mx-2 rounded-md" onClick={() => router.push("/signin")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            <div className="font-semibold">Sign in to your account</div>
          </div>}
        </div>
      }
    </>
  );
}
