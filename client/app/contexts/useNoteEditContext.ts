import { createContext, useContext } from "react"
import { Note } from "../definitions";

type TNoteEditContext = {
    note: Note,
    userId: string
}

export const NoteEditContext = createContext<TNoteEditContext | null>(null);

const useNoteEditContext = () => {
    const context = useContext(NoteEditContext);

    if (!context)
        throw new Error('useNoteEditContext must be called inside NoteEditContext.Provider');

    return context;
}

export default useNoteEditContext;