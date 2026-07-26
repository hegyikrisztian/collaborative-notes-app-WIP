"use client";
import { Note } from "../../definitions";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Breadcrumbs } from "../breadcrumbs";
import { NoteActions } from "./note-actions";
import { useLiveNoteContent } from "@/app/hooks/useLiveNoteContent";


export function NoteEdit({ note, userId }: { note: Note, userId: string }) {
    const { internalContent, handleContentChange } = useLiveNoteContent(userId, note.id, note.content)
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