"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useEditor } from "./EditorProvider";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import theme from "@/utils/theme";

import { useDebouncedCallback } from "use-debounce";

export default function Editor() {
  const editor = useEditor();
  const { save, previousNote } = editor;

  const savePreviousChanges = useCallback(() => {
    if (!previousNote) return;
    save(previousNote.content, previousNote.note_id);
  }, [save, previousNote]);

  useEffect(() => {
    console.log("Note changed");
    savePreviousChanges();
  }, [editor.note, savePreviousChanges]);

  const debounced = useDebouncedCallback((id: string) => {
    if (editor.note?.note_id === id) editor.save(editor.content);
  }, 1500);

  const handleChange = (value: string) => {
    editor.updateContent(value);
    if (editor.note?.note_id) debounced(editor.note?.note_id);
  };

  return (
    <div className={`group w-full h-full grid${false ? " grid-cols-2" : ""}`}>
      {/* Editor */}
      <div className="playground-container">
        <div className="playground-panel">
          <CodeMirror
            autoFocus
            value={editor.content}
            className="cm-outer-container pb-10"
            theme={theme}
            onChange={handleChange}
            spellCheck={false}
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
              EditorView.lineWrapping,
              hyperLink
            ]}
            basicSetup={{
              searchKeymap: false,
              closeBrackets: true,
              autocompletion: false
            }} />
        </div>
      </div>
    </div>
  );
}