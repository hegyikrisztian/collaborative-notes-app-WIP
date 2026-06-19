"use server";
import postgres from "postgres";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const NoteSchema = z.object({
    id: z.uuidv4(),
    title: z.string(),
    content: z.string(),
    last_modified: z.date(),
    creator: z.string()
});


const EditNoteContentSchema = NoteSchema.pick({ content: true });
type EditNoteState = {
    message: string
}

export async function editNoteContent(id: string, state: EditNoteState, formData: FormData): Promise<EditNoteState> {

    try {
        const { content } = EditNoteContentSchema.parse({
            content: formData.get('content'),
        });

        await sql`
            UPDATE notes
            SET content = ${content}, last_modified = ${new Date(Date.now()).toUTCString()} 
            WHERE id = ${id}
        `;

    }
    catch (error) {
        console.error('DB error in editNote ', error );
        throw new Error('Error editing content');
    }
    
    revalidatePath('/notes');
    redirect('/notes');
}

// export async function editNote(id: string, formData: FormData) {
//     try {
//         const { title, content, creator } = CreateNoteSchema.parse({
//             title: formData.get('title'),
//             content: formData.get('content'),
//             creator: formData.get('creator')
//         });

//         await sql`
//             UPDATE notes
//             SET title = ${title}, content = ${content}, creator = ${creator}, last_modified = ${new Date(Date.now())} 
//             WHERE id = ${id}
//         `;

//     }
//     catch (error) {
//         console.error('DB error in editNote ', error );
//         throw new Error('Error editing note');
//     }
    
//     revalidatePath('/notes');
//     redirect('/notes');
// }

export async function deleteNote(id: string) {
    try {
        await sql`DELETE FROM notes WHERE id = ${id}`;
    }
    catch (error) {
        console.error('DB error in editNote ', error );
        throw new Error('Error editing note');
    }
    
    revalidatePath('/notes');
    redirect('/notes');
}
