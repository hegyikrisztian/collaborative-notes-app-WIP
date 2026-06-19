import { getNote } from "@/app/lib/data";
import { NoteEdit } from "@/app/ui/notes/note-edit";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const note = await getNote(params.id);

    return (
        <div className="flex flex-col gap-6 w-full h-full">
            <NoteEdit note={note}/>
        </div>
    )
}