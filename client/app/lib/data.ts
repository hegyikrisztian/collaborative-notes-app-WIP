
import postgres from "postgres";
import { Note } from "../definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', prepare: false });
/*
select n.id, n.title, n.content, n.last_modified, n.creator
               from notes n inner join users_notes un on un.creator_id = n.creator
               where (un.creator_id = '90184a99-c3e4-48b9-8a17-94b06a6b0c8e' and un.note_id = n.id) or n.creator = '90184a99-c3e4-48b9-8a17-94b06a6b0c8e'; 
 */
export async function fetchNotes(userId: string | undefined) {
    try {
        if (!userId)
            throw new Error('Provide userId for fetchNotes');

        const notes = await sql<Note[]>`
            select n.id, n.title, n.content, n.last_modified, n.creator 
            from notes n inner join users_notes un on un.note_id = n.id
            where un.creator_id = ${userId} or n.creator = ${userId};
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
        const notes = await sql<Note[]>`select * from notes where id = ${id}`;
        return notes[0];
    }
    catch (error) {
        console.error('DB error in fetchNotes', error);
        throw new Error('Error fetching notes');
    }
}
