"use client";
import { addUsersToNote } from "@/app/lib/actions/notes";
import { useActionState, useRef } from "react";
import MultiSelectUsers from "../../inputs/multi-select-users";
import useDialog from "@/app/hooks/useDialog";
import { Dialog } from "../../dialogs/dialog";
import { MainButton, SecondaryButton } from "../../buttons/button";

const initialState = {
    message: ''
}

export default function AddUsersModal({ noteId }: { noteId: string }) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const { toggleDialog } = useDialog(dialogRef);
    const [state, formAction, isPending] = useActionState(addUsersToNote.bind(null, noteId), initialState);

    return (
        <>
            <MainButton onClick={toggleDialog}>
                + Add users
            </MainButton>

            <Dialog ref={dialogRef}>
                <form action={formAction} className="bg-gray-800 outline-1 outline-gray-600 shadow-2xl p-5 rounded-2xl flex flex-col gap-10 z-10 new-note-form-transition w-2xl">
                    {state?.message && <p className="text-sm text-red-500">{state.message}</p>}
                    <div className="flex flex-col items-start justify-center gap-1 m-0 p-0">
                        <MultiSelectUsers />
                    </div>
                    <Dialog.Actions>
                        <MainButton disabled={isPending} type="submit">
                            {isPending ? 'Loading...' : 'Add'}
                        </MainButton>
                        <SecondaryButton onClick={toggleDialog} type="button">
                            Cancel
                        </SecondaryButton>
                    </Dialog.Actions>
                </form>
            </Dialog>
        </>
    )
}