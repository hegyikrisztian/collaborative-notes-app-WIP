"use client";
import { ReactNode } from "react";
import { NoteEditContext } from "@/app/contexts/useNoteEditContext";
import { Note } from "@/app/definitions";

export const NoteEditContextWrapper = ({ note, userId, children }: { note: Note, userId: string, children: ReactNode }) => {
    const value = {
        note,
        userId
    }

    return ( 
        <NoteEditContext.Provider value={value}>
            {children}
        </NoteEditContext.Provider>
    );
}