"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useEditor } from "../EditorProvider";
import { useSupabase } from "../supabaseProvider";

export default function Upload() {
  const editor = useEditor();
  const { supabase } = useSupabase();
  const router = useRouter();
  const path = usePathname();

  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!editor.note || loading) return;
    setLoading(true);
    console.log(editor.note);
    await supabase
      .from("notes_v2")
      .insert(editor.note)
      .select()
      .single();
    setLoading(false);
    router.push(`/notes/${editor.note.slug}`);
  };


  return (
    <div className="flex flex-col pt-4 pl-1 pr-3 text-xs select-none h-full overflow-auto text-text-medium">
      <div className="flex box-border items-center pl-2 mb-2 h-6 overflow-hidden">
        <h1 className="text-text-light overflow-hidden overflow-ellipsis">{path === "/notes" ? "Upload" : "Hastenote"}</h1>
      </div>
      <div className="mx-1 flex flex-col space-y-2 whitespace-normal">
        {path === "/notes"
          ? <>
            <p>You are not currently signed in.</p>
            <p>Your note will be uploaded anonymously and cannot be edited.</p>
            <button disabled={loading || editor.content.length < 10} onClick={() => upload()} className="mt-2 text-text-xlight disabled:bg-button-neutral disabled:cursor-not-allowed bg-button-special outline-none rounded-md h-8 font-bold hover:bg-button-special/80">Upload</button>
          </>
          : <>
            <p>You are viewing an anonymous note.</p>
            <button onClick={() => navigator.clipboard.writeText(`https://hastenote.com/${path.split("/")[2]}`)} className="mt-2 text-text-xlight bg-button-special outline-none rounded-md h-8 font-bold hover:bg-button-special/80">
              Copy Link
            </button>
          </>
        }
      </div>
    </div>
  );
}
