"use client";
import { useEffect, useRef, useState } from "react";
import { NOTE_EVENTS, NOTE_CONTENT_STATUS, User } from "../lib/definitions";
import useNoteEditContext from "../contexts/useNoteEditContext";

export const useLiveNoteContent = () => {
    const { note, userId } = useNoteEditContext();
    const noteId = note.id;

    const ws = useRef<null | WebSocket>(null);
    const [status, setStatus] = useState(NOTE_CONTENT_STATUS.FRESH)
    
    const [internalContent, setInternalContent] = useState<string>(note.content);
    const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

    useEffect(() => {
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
                    break;
                case NOTE_EVENTS.NOTE_CONTENT_SYNCH_COMPLETE:
                    if (data?.noteId === noteId) {
                        setStatus(NOTE_CONTENT_STATUS.FRESH);
                    }
                    else {
                        console.warn(`${NOTE_EVENTS.NOTE_CONTENT_SYNCH_COMPLETE} sent incorrect data: ${data}`);
                    }
                    break;
                case NOTE_EVENTS.NOTE_CONTENT_CONNECTED_USERS:
                    if (!data?.users)
                        console.error(`No users array for ${NOTE_EVENTS.NOTE_CONTENT_CONNECTED_USERS}, data: ${data}`);
                    else {
                        setConnectedUsers(data?.users);
                    }
                    break;
                case NOTE_EVENTS.ERROR:
                    console.log('Server error: ', data?.message);
                    setStatus(NOTE_CONTENT_STATUS.ERROR);
                    break;
                default:
                    break;
            }
        }

        ws.current.onclose = () => {
            console.log('Connection closed');
        }

        const wsCurrent = ws.current;
        return () => {
            wsCurrent.close(1000, noteId);
        }
    }, [])

    function synchServerStateWithContent(content: string) {    
        
        
        setStatus(NOTE_CONTENT_STATUS.PENDING);
        ws.current?.send(JSON.stringify({
            type: NOTE_EVENTS.NOTE_CONTENT_CHANGE,
            noteId: noteId,
            content: content,
        }));
    }

    useEffect(() => {
        if (!ws.current) {
            console.warn('No websocket connection available');
            return
        }

        if (ws.current.readyState === WebSocket.CONNECTING) {
            console.log('WebSocket connecting');
            return
        }

        synchServerStateWithContent(internalContent);
    }, [internalContent])

    return { internalContent, setInternalContent, status, connectedUsers };
}