"use server";
import postgres from "postgres";
import { z } from "zod";
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

const AddUsersToNoteSchema = z.object({
    users: z.string()
})
type AddUsersToNoteState = {
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

export async function addUsersToNote(id: string, state: AddUsersToNoteState, formData: FormData): Promise<AddUsersToNoteState> {
    try {
        console.log(id);
        const { users } = AddUsersToNoteSchema.parse({
            users: formData.get('selectedUsers')
        });

        if (!users)
            return { message: 'Provide users to addUsersToNote' };

        const userIds = users.split(',');
        const usersNotes = userIds.map(userId => (
            {
                note_id: id,
                creator_id: userId
            }
        ));
        console.log(usersNotes);
        await sql`insert into users_notes ${ sql(usersNotes) }`;
        return { message: '' };
    }
    catch (error) {
        console.error(`Error adding users to note: ${error}`);
        throw new Error(`Error adding users to note: ${error}`);
    }
}
