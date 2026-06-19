import { fetchNotes } from "@/app/lib/data";
import { NewNote } from "./new-note-card";
import NoteCard from "./note-card";
import { verifySession } from "@/app/lib/session";
import { redirect } from "next/navigation";

const NoteList = async () => {
    const { userId } = await verifySession();

    if (!userId)
        redirect('/login');
    
    const notes = await fetchNotes(userId as string);

    return (
        <>
            {notes.map((note) => (
                <NoteCard key={note.id} note={note}/>
            ))}
            <NewNote />
        </>
    );
}
 
export default NoteList;