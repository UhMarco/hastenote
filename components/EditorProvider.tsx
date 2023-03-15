import { createContext, ReactNode, useContext } from "react";

type EditorContext = {
  refresh: () => void;
};

const Context = createContext<EditorContext | undefined>(undefined);

export default function EditorProvider({ refresh, children }: { refresh: () => void, children: ReactNode; }) {
  return (
    <Context.Provider value={{ refresh }}>
      {children}
    </Context.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useEditor must be used inside NoteProvider");
  } else {
    return context;
  }
};