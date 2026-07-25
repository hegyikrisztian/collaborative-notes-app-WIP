import { fetchNotes } from "@/app/lib/data";
import NoteCard from "./note-card";
import { verifySession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { CreateNote } from "./modals/create-note";

const NoteList = async () => {
    const { userId } = await verifySession();
    
    const notes = await fetchNotes(userId as string);

    return (
        <>
            {notes.map((note) => (
                <NoteCard key={note.id} note={note}/>
            ))}
            <CreateNote />
        </>
    );
}
 
export default NoteList;