import { ChangeEvent, useEffect, useRef, useState } from "react";

export const useLiveNoteContent = (userId: string, noteId: string, noteContent: string) => {
    const ws = useRef<null | WebSocket>(null)

    const [internalContent, setInternalContent] = useState<string>(noteContent);
    // TODO: custom hooks for these!
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8081');

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
            return
        }

        ws.current?.send(JSON.stringify({
            type: 'note-content-change',
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