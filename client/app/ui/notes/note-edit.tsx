"use client";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { Breadcrumbs } from "../breadcrumbs";
import { NoteActions } from "./note-actions";
import { useLiveNoteContent } from "@/app/hooks/useLiveNoteContent";
import { NOTE_CONTENT_STATUS } from "@/app/lib/definitions";
import { ConnectedUsers } from "./connected-users";
import useNoteEditContext from "@/app/contexts/useNoteEditContext";
import { Toolbar } from "./toolbar";


export function NoteEdit() {
    const { note } = useNoteEditContext();
    const { internalContent, handleContentChange, status, connectedUsers } = useLiveNoteContent()

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

                        <ConnectedUsers users={connectedUsers} />

                    </div>
                    {status === NOTE_CONTENT_STATUS.ERROR ?
                        <ExclamationCircleIcon className="w-5"/>
                        :
                        <NoteActions noteId={note.id} isSaving={status === NOTE_CONTENT_STATUS.PENDING}/>
                    }
                </div>
                <div className="bg-gray-900 flex flex-col gap-1 justify-center w-full items-center m-0 h-full">
                    <Toolbar />
                    <textarea onChange={handleContentChange} value={internalContent} className="outline-1 outline-gray-600 rounded-2xl shadow-2xl h-full w-full p-5" name="content"></textarea>
                </div>
            </div>
        </>
    )
}