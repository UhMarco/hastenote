"use client";

import { useState, useCallback, useEffect } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";

import theme from "./Theme";
import { useSupabase } from "./supabase-provider";

import { useDebouncedCallback } from "use-debounce";

export default function Editor({ content: c, slug: s, readOnly }: { content?: string, slug?: string, readOnly?: boolean; }) {
  const { supabase, user } = useSupabase();

  const [content, setContent] = useState(c);
  const [slug, setSlug] = useState<string>();

  // Save new note content.
  const saveChanges = async (newContent: string) => {
    // Don't save anonymous notes.
    if (!user) return;
    await supabase.from("notes_v2").update({ content: newContent }).eq("slug", slug);
    console.log("Updated: ", slug);
  };

  // Ensure data is not lost if a note is closed within 1.5 seconds of a change being made.
  // const saveChangesOnNoteClose = useCallback(async (slug: string) => {
  //   await supabase.from("notes_v2").update({ content }).eq("slug", slug);
  //   console.log("Updated on close: ", slug);
  // }, [content, supabase]);

  // Change content when note is changed.
  // A better way of doing this would be to cycle between editor states. Implement at end of project if time allows.
  // See https://discuss.codemirror.net/t/swapdoc-v6-equivalent/5973
  useEffect(() => {
    // Save previous note changes using previous slug.
    // if (user && slug) saveChangesOnNoteClose(slug);
    setSlug(s);
    // Set new content.
    setContent(c);
  }, [c, s, user, slug]);

  // Save after 1.5 seconds of inactivity.
  const debounced = useDebouncedCallback(value => saveChanges(value), 1500);

  // Update stored content state when editor content is changed.
  const onChange = useCallback((value: any) => {
    setContent(value);
    debounced(value);
  }, [debounced]);

  return (
    <div className="w-full h-full group">
      {/* Editor */}
      <div className="playground-container">
        <div className="playground-panel">
          <CodeMirror
            autoFocus
            className="cm-outer-container pr-10 pb-10"
            value={content}
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
              EditorView.lineWrapping,
              hyperLink
            ]}
            theme={theme}
            readOnly={readOnly}
            spellCheck={false}
            onChange={readOnly ? () => null : onChange}
            basicSetup={{
              searchKeymap: false,
              closeBrackets: true,
              autocompletion: false
            }}
          />
        </div>
      </div>
      {/* View Mode */}
      <div className="absolute right-3 bottom-3 hidden group-hover:block">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-button-special py-2 px-2 text-sm font-semibold text-text-xlight shadow-sm hover:bg-button-special/70"
        >
          <svg className="h-5 w-5 stroke-text-xlight" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
