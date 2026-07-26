import { getNote } from "@/app/lib/data";
import { verifySession } from "@/app/lib/session";
import { NoteEdit } from "@/app/ui/notes/note-edit";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { userId } = await verifySession();

    if (!userId)
        redirect('/login');

    const params = await props.params;
    const note = await getNote(params.id);

    return (
        <div className="flex flex-col gap-6 w-full h-full">
            <NoteEdit note={note} userId={userId as string}/>
        </div>
    )
}