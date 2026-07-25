"use client";
import { Note } from "../../definitions";
import { editNoteContent } from "../../lib/actions/notes";
import { ChangeEvent, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumbs } from "../breadcrumbs";
import { DeleteNote } from "./buttons/note-delete";
import { PencilIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { io, Socket } from "socket.io-client";
import AddUsersModal from "./modals/add-users-note";
import { NoteActions } from "./note-actions";

const initialState = {
    message: ''
}

let socket: Socket;

export function NoteEdit({ note }: { note: Note }) {
    const [isAddUsersOpen, setIsAddUsersOpen] = useState(true);

    const [internalContent, setInternalContent] = useState<string>(note.content);
    const editNoteContentWithId = editNoteContent.bind(null, note.id);
    const [state, editNoteContentWithIdFormAction, isPending] = useActionState(editNoteContentWithId, initialState)

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) {
        setInternalContent(event.target.value)
        socket.emit('note-content-change', {
            noteId: note.id,
            content: event.target.value
        })
    }

    async function socketInitializer() {
        await fetch('/api/socket');
        socket = io();

        socket.on(`note-content-${note.id}-changed`, (content) => {
            setInternalContent(content);
        });
    }

    useEffect(() => {
        socketInitializer(); 
    }, [])

    const isChanged = useMemo(() => note.content !== internalContent, [internalContent]);

    return (
        <>
            <div className="bg-gray-900 flex flex-col gap-6 justify-center items-center p-10 m-0 h-full">
                <div className="flex justify-between w-full items-end">
                    <div className="flex flex-row gap-10">
                        <Breadcrumbs
                            breadcrumbs={[
                                {
                                    active: false,
                                    href: '/notes',
                                    name: 'Notes'
                                },
                                {
                                    active: true,
                                    href: `/notes/${note.id}`,
                                    name: note.title
                                },
                            ]}
                            />

                        {/* Dummy users list for now */}
                        <ul className="flex flex-row gap-2">
                            <li className="w-5 h-5 rounded-full bg-red-400 shadow-2xl p-0 m-0 leading-5 text-center text-xs">P</li>
                            <li className="w-5 h-5 rounded-full bg-blue-400 shadow-2xl p-0 m-0 leading-5 text-center text-xs">M</li>
                            <li className="w-5 h-5 rounded-full bg-green-400 shadow-2xl p-0 m-0 leading-5 text-center text-xs">S</li>
                            <li className="w-5 h-5 rounded-full bg-purple-400 shadow-2xl p-0 m-0 leading-5 text-center text-xs">Z</li>
                        </ul>
                        {/*  */}

                    </div>
                    <NoteActions id={note.id}/>
                </div>
                <form className="flex flex-col gap-1.5 w-full h-full" action={editNoteContentWithIdFormAction}>
                    <textarea onChange={handleContentChange} value={internalContent} className="outline-1 outline-gray-600 rounded-2xl shadow-2xl h-full w-full p-5" name="content"></textarea>
                    <div className="absolute bottom-10 right-10 flex flex-row gap-3 self-end">
                        <button className="flex gap-2 rounded-full px-4 py-2.5 text-blue-50 border-blue-50 border cursor-pointer hover:scale-105 transition-[scale] text-xl" type="submit">
                            <XMarkIcon className="w-5"/>
                            Cancel
                        </button>
                        <button disabled={!isChanged || isPending} className="flex gap-2 disabled:opacity-50 rounded-full px-4 py-2.5 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-xl" type="submit">
                            <PencilIcon className="w-5"/>
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}