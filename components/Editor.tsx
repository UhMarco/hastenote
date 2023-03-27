"use client";

import { useCallback, useEffect, useState } from "react";

import { useEditor } from "./EditorProvider";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import theme from "@/utils/theme";

import { useDebouncedCallback } from "use-debounce";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

import styles from "./Editor.module.css";

export default function Editor({ readOnly }: { readOnly?: boolean; }) {
  const editor = useEditor();
  const { save, previousNote } = editor;

  const [mode, setMode] = useState(0); // 0: Editor, 1: Preview, 2: Splitscreen

  // Save the previously opened note when the note is switched.
  const savePreviousChanges = useCallback(() => {
    if (!previousNote?.note_id) return;
    save(previousNote.content, previousNote.note_id);
  }, [save, previousNote]);

  useEffect(() => {
    console.log("Note changed");
    savePreviousChanges();
  }, [editor.note, savePreviousChanges]);

  // Debounce automatically saving.
  // Make sure the note we're trying to save is the currently opened note and the user has not switched since this method was originally called.
  const debounced = useDebouncedCallback((id: string) => {
    if (editor.note?.note_id === id) editor.save(editor.content);
  }, 1500);

  const handleChange = (value: string) => {
    editor.updateContent(value);
    if (editor.note?.note_id) debounced(editor.note?.note_id);
  };

  return (
    <div className={`group w-full h-full grid${mode === 2 ? " grid-cols-2" : ""}`}>
      {/* Editor */}
      <div className={mode === 1 ? "hidden" : "playground-container"}>
        <div className="playground-panel">
          <CodeMirror
            autoFocus
            readOnly={readOnly}
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
      {/* Preview */}
      {mode != 0 &&
        <div className={`px-6 py-2 w-full ${styles["markdown-body"]}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, remarkGemoji]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <SyntaxHighlighter
                    language={match ? match[1] : ""}
                    PreTag="div"
                    style={codeTheme as any}
                    CodeTag="div"
                    {...props}
                  >{String(children).replace(/\n$/, "")}</SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {editor.content || ""}
          </ReactMarkdown>
        </div>
      }
      {/* View Mode */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-500 flex absolute right-3 bottom-3 flex-col items-center p-2 rounded-md bg-bg-dark">

        <button
          type="button"
          onClick={() => setMode(mode === 2 ? 0 : 2)}
          className="text-sm font-semibold text-text-xlight shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="w-full px-0.5 bg-white/10 rounded-md h-[1px] my-2"></div>
        <button
          type="button"
          onClick={() => setMode(mode === 0 ? 1 : 0)}
          className="text-sm font-semibold text-text-xlight shadow-sm"
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