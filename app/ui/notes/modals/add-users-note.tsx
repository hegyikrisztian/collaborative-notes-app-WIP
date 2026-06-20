"use client";
import useFetchUsers from "@/app/hooks/useFetchUsers";
import { addUsersToNote } from "@/app/lib/actions/notes";
import { useActionState, useState } from "react";

const initialState = {
    message: ''
}
export default function AddUsersModal({ isOpen, noteId, handleClose }: { isOpen: boolean, noteId: string, handleClose: () => void }) {
    const [query, setQuery] = useState('new');
    const [state, formAction, isPending] = useActionState(addUsersToNote.bind(null, noteId), initialState);
    const users = useFetchUsers(query);

    console.log(users);
    return (
        <>
            {isOpen && (
                <div className="p-10 flex justify-center items-center fixed top-0 left-0 h-screen w-screen z-0 backdrop-blur-transition">
                    <form action={formAction} className="bg-gray-800 outline-1 outline-gray-600 shadow-2xl p-5 rounded-2xl flex flex-col gap-10 z-10 new-note-form-transition w-2xl">
                        {state?.message && <p className="text-sm text-red-500">{state.message}</p>}
                        <div className="flex flex-col items-start justify-center gap-1 m-0 p-0">
                            <label htmlFor="users" className="italic opacity-50">Users</label>
                            <select multiple className="p-4 w-50 rounded-md border-0 border-b appearance-none font-inherit" name="users" id="users" onInput={(event) => console.log(event)}>
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-row self-end gap-3">
                            <button className="flex self-end gap-2 disabled:opacity-50 rounded-full px-2 py-1 text-blue-50 border-blue-50 border not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md" onClick={handleClose} type="button">Cancel</button>
                            <button disabled={isPending} className="flex self-end gap-2 disabled:opacity-50 rounded-full px-2 py-1 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md" type="submit">{isPending ? 'Loading...' : 'Add'}</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}