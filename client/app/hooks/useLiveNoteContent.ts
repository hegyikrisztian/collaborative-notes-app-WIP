"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { NOTE_EVENTS } from "../lib/definitions";

export const useLiveNoteContent = (userId: string, noteId: string, noteContent: string) => {
    const ws = useRef<null | WebSocket>(null)
    const [internalContent, setInternalContent] = useState<string>(noteContent);

    useEffect(() => {
        console.log(ws.current);
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

        ws.current.onopen = () => {
            const initialPayload = {
                noteId: noteId,
                userId: userId  // test with uuid()
            };

            ws.current?.send(JSON.stringify(initialPayload));
        }

        ws.current.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            const type = data?.type

            if (!type) {
                console.warn('No type in server message');
                return
            }

            switch (type) {
                case NOTE_EVENTS.NEW_NOTE_CONTENT:
                    setInternalContent(data?.content)
                    break
                case NOTE_EVENTS.ERROR:
                    console.log('Server error: ', data?.message)
                    break
                default:
                    break
            }
        }

        ws.current.onclose = () => {
            console.log('Connection closed');
        }

        const wsCurrent = ws.current;
        return () => {
            console.log('I close');
            wsCurrent.close(1000, noteId);
        }
    }, [])

    function synchServerStateWithContent(content: string) {    
        if (!ws.current) {
            console.warn('No websocket connection available');
            return
        }

        ws.current?.send(JSON.stringify({
            type: NOTE_EVENTS.NOTE_CONTENT_CHANGE,
            noteId: noteId,
            content: content,
        }))
    }

    // Update internal state optimistically, so user's changes are instant
    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) {
        const value = event.target.value;
        setInternalContent(value);

        synchServerStateWithContent(value);
    }

    return { internalContent, handleContentChange };
}