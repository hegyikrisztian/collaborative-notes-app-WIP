
import postgres from "postgres";
import { Note } from "../definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', prepare: false });

export async function fetchNotes(userId: string | undefined) {
    try {
        if (!userId)
            throw new Error('Provide userId for fetchNotes');

        const notes = await sql<Note[]>`
            SELECT * FROM notes where creator = ${userId}
        `;
        
        return notes;
    }
    catch (error) {
        console.error('DB error in fetchNotes', error);
        throw new Error('Error fetching notes');
    }
}

export async function getNote(id: string) {
    try {
        const notes = await sql<Note[]>`SELECT * FROM notes WHERE id = ${id}`;
        return notes[0];
    }
    catch (error) {
        console.error('DB error in fetchNotes', error);
        throw new Error('Error fetching notes');
    }
}
