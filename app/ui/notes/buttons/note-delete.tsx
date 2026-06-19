import { deleteNote } from "@/app/lib/actions/notes";
import { TrashIcon } from "@heroicons/react/16/solid";

export function DeleteNote({ id }: { id: string }) {
    const deleteNoteWithId = deleteNote.bind(null, id);

    // TBD add dialog
    return (
        <form action={deleteNoteWithId}>
            <button className="border border-[#e31200] rounded-md cursor-pointer p-2.5 hover:not-disabled:scale-105 transition-[scale]" type="submit">
                <TrashIcon color="#e31200" className="w-7" />
            </button>
        </form>
    )
}