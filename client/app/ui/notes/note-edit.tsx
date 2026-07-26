"use client";
import { Note } from "../../definitions";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumbs } from "../breadcrumbs";
import { NoteActions } from "./note-actions";


export function NoteEdit({ note, userId }: { note: Note, userId: string }) {
    const ws = useRef<null | WebSocket>(null)

    const [internalContent, setInternalContent] = useState<string>(note.content);
    // TODO: custom hooks for these!
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8081');

        ws.current.onopen = () => {
            const initialPayload = {
                noteId: note.id,
                userId: userId  // test with uuid()
            };

            ws.current?.send(JSON.stringify(initialPayload));
        }

        ws.current.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            const type = data?.type
            console.log(data);
            if (!type) {
                console.warn('No type in server message');
                return
            }

            switch (type) {
                case 'new-note-content':
                    setInternalContent(data?.content)
                    break
                case 'error':
                    console.error(data?.message)
                    break
                default:
                    break
            }
        }

        ws.current.onclose = () => {
            console.log('Connection closed');
        }

        const wsCurrent = ws.current;
        // return () => {
        //     wsCurrent.close();
        // }
    }, [])

    function synchServerStateWithContent(content: string) {    
        if (!ws.current) {
            console.warn('No websocket connection available');
        }

        ws.current?.send(JSON.stringify({
            type: 'note-content-change',
            noteId: note.id,
            content: content,
        }))
    }

    // 
    // useEffect(() => {
    //     const id = setTimeout(() => synchServerStateWithContent(), 300)
    //     return () => {
    //         clearTimeout(id)
    //     }
    // }, [internalContent])

    // Update internal state optimistically, so user's changes are instant
    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) {
        const value = event.target.value;
        setInternalContent(value);

        // I could send the new data here on every single keystroke
        // Possible concern is the rate?
        synchServerStateWithContent(value)
    }

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
                <textarea onChange={handleContentChange} value={internalContent} className="outline-1 outline-gray-600 rounded-2xl shadow-2xl h-full w-full p-5" name="content"></textarea>
                <div className="absolute bottom-10 right-10 flex flex-row gap-3 self-end">
                    <button className="flex gap-2 rounded-full px-4 py-2.5 text-blue-50 border-blue-50 border cursor-pointer hover:scale-105 transition-[scale] text-xl" type="submit">
                        <XMarkIcon className="w-5"/>
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}