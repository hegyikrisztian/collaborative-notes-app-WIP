"use client";
import { addUsersToNote } from "@/app/lib/actions/notes";
import { useActionState, useRef } from "react";
import MultiSelectUsers from "../../inputs/multi-select-users";
import useDialog from "@/app/hooks/useDialog";

const initialState = {
    message: ''
}

export default function AddUsersModal({ noteId }: { noteId: string }) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const { toggleDialog } = useDialog(dialogRef);
    const [state, formAction, isPending] = useActionState(addUsersToNote.bind(null, noteId), initialState);

    return (
        <>
            <button onClick={toggleDialog} className="flex gap-2 disabled:opacity-50 rounded-full px-4 py-2 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md">
                + Add users
            </button>

            <dialog ref={dialogRef} className="p-0 m-0 bg-transparent open:h-screen backdrop-blur-lg overflow-hidden open:w-screen open:flex open:items-center open:justify-center open:text-white">
                <div className="p-10 flex justify-center items-center fixed top-0 left-0 h-screen w-screen z-0 backdrop-blur-transition">
                    <form action={formAction} className="bg-gray-800 outline-1 outline-gray-600 shadow-2xl p-5 rounded-2xl flex flex-col gap-10 z-10 new-note-form-transition w-2xl">
                        {state?.message && <p className="text-sm text-red-500">{state.message}</p>}
                        <div className="flex flex-col items-start justify-center gap-1 m-0 p-0">
                            <MultiSelectUsers />
                        </div>
                        <div className="flex flex-row self-end gap-3">
                            <button className="flex self-end gap-2 disabled:opacity-50 rounded-full px-2 py-1 text-blue-50 border-blue-50 border not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md" onClick={toggleDialog} type="button">Cancel</button>
                            <button disabled={isPending} className="flex self-end gap-2 disabled:opacity-50 rounded-full px-2 py-1 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md" type="submit">{isPending ? 'Loading...' : 'Add'}</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}