"use client";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { Breadcrumbs } from "../breadcrumbs";
import { NoteActions } from "./note-actions";
import { useLiveNoteContent } from "@/app/hooks/useLiveNoteContent";
import { NOTE_CONTENT_STATUS, transformTypeMarker } from "@/app/lib/definitions";
import { ConnectedUsers } from "./connected-users";
import useNoteEditContext from "@/app/contexts/useNoteEditContext";
import { Toolbar } from "./toolbar";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { TransformType } from "@/app/lib/definitions";


export function NoteEdit() {
    const { note } = useNoteEditContext();
    const { internalContent, setInternalContent, status, connectedUsers } = useLiveNoteContent()
    
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    const contentRef = useRef<HTMLTextAreaElement | null>(null);

    const handleToolbarButtonClick = (transformType: TransformType) => {
        return () => {
            const selectedText = internalContent.slice(start, end);
            if (selectedText.length <= 0)
                return;

            let marker = transformTypeMarker[transformType];
            if (!marker)
                throw new Error(`No marker string found; transformType ${transformType} is not member of transformTypeMarker`);

            // Handle multiple markers on text (e.g.: bold and italic)
            // Array of markers and decide which to add / remove based on transformType
            const hasStartMarker = internalContent.slice(start - marker.length, start) === marker;
            const hasEndMarker = internalContent.slice(end, end + marker.length) === marker;

            // Offset for restoring selection
            const offset = marker.length;

            // Text before and after
            let leading = internalContent.slice(0, start);
            let trailing = internalContent.slice(end, internalContent.length);
            if (hasStartMarker && hasEndMarker) {
                // Remove marker
                leading = leading.replace(marker, '');
                trailing = trailing.replace(marker, '');
                marker = '';
            }

            // Mark text, even if there is a marker already at the end or start
            // Stitch together and add marker
            const newContent = `${leading}${marker}${selectedText}${marker}${trailing}`;
            setInternalContent(newContent);

            // Defer restoring selection with setTimeout, since setter above happens after these would synchronously run
            setTimeout(() => {
                contentRef.current?.focus();

                if (marker.length === 0)
                    contentRef.current?.setSelectionRange(start - offset, end - offset);
                else
                    contentRef.current?.setSelectionRange(start + offset, end + offset);
            })
        }
    }

    useEffect(() => {
        if (!contentRef.current)
            return;

        function onSelect(event: Event) {
            const textareaElement = event.target as HTMLTextAreaElement;

            if (!textareaElement)
                return;

            setStart(textareaElement.selectionStart);
            setEnd(textareaElement.selectionEnd);
        }

        contentRef.current.addEventListener('select', onSelect);
        
        return () => {
            contentRef.current?.removeEventListener('select', onSelect);
            contentRef.current = null;
        }
    }, [])

    const handleChangeContent = (event: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
        setInternalContent(event.target.value);
    }

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
                <div className="bg-gray-900 flex flex-col gap-1 justify-center w-full h-full items-center m-0 border-gray-600 border rounded-2xl shadow-2xl p-3">
                    <Toolbar handleToolbarButtonClick={handleToolbarButtonClick}/>
                    <textarea ref={contentRef} onChange={handleChangeContent} value={internalContent} className="p-5 h-full w-full outline-none" name="content"></textarea>
                </div>
            </div>
        </>
    )
}