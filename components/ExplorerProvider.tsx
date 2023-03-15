import { createContext, ReactNode, useContext } from "react";

type ExplorerContext = {
  refresh: () => void;
};

const Context = createContext<ExplorerContext | undefined>(undefined);

export default function ExplorerProvider({ refresh, children }: { refresh: () => void, children: ReactNode; }) {
  return (
    <Context.Provider value={{ refresh }}>
      {children}
    </Context.Provider>
  );
}

export const useExplorer = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useEditor must be used inside NoteProvider");
  } else {
    return context;
  }
};