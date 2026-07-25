"use client";
import { SubmitEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/16/solid";
import useDialog from "@/app/hooks/useDialog";

type FormElements = HTMLFormControlsCollection & {
    title: HTMLInputElement
}

export function CreateNote() {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const { toggleDialog } = useDialog(dialogRef);

    // TODO: create hook for cancelable form
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState('');

    const submitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setIsPending(true);

        if (!abortControllerRef.current)
            abortControllerRef.current = new AbortController();

        const elements = e.currentTarget.elements as FormElements
        try {
            const response = await fetch("/api/notes", {
                method: 'POST',
                body: JSON.stringify({
                    title: elements.title.value
                }),
                signal: abortControllerRef.current.signal,
            })
            const json = await response.json();
            if (response.status === 201) {
                router.replace(`/notes/${json?.id}`);
            }
            else {
                setMessage(json?.message);
            }
        }
        catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                setMessage("Request cancelled");
            } else {
                setMessage("Unexpected error");
            }
        }
        finally {
            setIsPending(false);
            abortControllerRef.current = null;
        }
    }

    const handleCancel = () => {
        abortControllerRef.current?.abort('Cancel creating note');
        toggleDialog()
    }
    
    return (
        <>
            <button onClick={toggleDialog} className="w-32 hover:cursor-pointer hover:scale-105 transition-[scale] flex h-32 justify-center hover:outline-1 outline-gray-600 bg-gray-800 p-2.5 rounded-2xl shadow-2xl" type="button">
                <PlusIcon className="w-10"/>
            </button>

            <dialog ref={dialogRef} className="p-0 m-0 bg-transparent open:h-screen backdrop-blur-lg overflow-hidden open:w-screen open:flex open:items-center open:justify-center open:text-white">
                <form onSubmit={submitForm} className="bg-gray-800 outline-1 outline-gray-600 shadow-2xl p-5 rounded-2xl flex flex-col gap-10 z-10 new-note-form-transition">
                    {message && <p className="text-sm text-red-500">{message}</p>}
                    <div className="flex flex-col items-start justify-center gap-0 m-0 p-0">
                        <label htmlFor="title" className="italic opacity-50">Title</label>
                        <input type="text" name="title" className="focus:outline-blue border-b p-2 rounded-md text-white" placeholder="My new note..."/>
                    </div>
                    <div className="flex flex-row self-end gap-3">
                        <button className="flex self-end gap-2 disabled:opacity-50 rounded-full px-2 py-1 text-blue-50 border-blue-50 border not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md" onClick={handleCancel} type="button">Cancel</button>
                        <button disabled={isPending} className="flex self-end gap-2 disabled:opacity-50 rounded-full px-2 py-1 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md" type="submit">{isPending ? 'Creating...' : 'Create'}</button>
                    </div>
                </form>
            </dialog>
        </>
    )
}