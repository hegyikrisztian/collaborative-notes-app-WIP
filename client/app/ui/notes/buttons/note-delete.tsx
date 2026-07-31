import useDialog from "@/app/hooks/useDialog";
import { deleteNote } from "@/app/lib/actions/notes";
import { TrashIcon } from "@heroicons/react/16/solid";
import { useRef } from "react";
import { Dialog } from "../../dialogs/dialog";
import { ErrorIconButton, MainButton, SecondaryButton } from "../../buttons/button";

export function DeleteNote({ noteId }: { noteId: string }) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const { toggleDialog } = useDialog(dialogRef);

    const deleteNoteWithId = deleteNote.bind(null, noteId);

    return (
        <>
            <ErrorIconButton onClick={toggleDialog}>
                <TrashIcon color="#e31200" className="w-5" />
            </ErrorIconButton>

            <Dialog ref={dialogRef}>
                <form action={deleteNoteWithId} className="bg-gray-800 outline-1 outline-gray-600 shadow-2xl p-5 rounded-2xl flex flex-col gap-10 z-10 w-2xl">
                    <p>Are you sure you want to delete this note?</p>
                    <Dialog.Actions>
                        <MainButton type="submit">
                            Delete
                        </MainButton>
                        <SecondaryButton type="button" onClick={toggleDialog}>
                            Cancel
                        </SecondaryButton>
                    </Dialog.Actions>
                </form>
            </Dialog>
        </>
    )
}