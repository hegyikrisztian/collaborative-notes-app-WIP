"use client";
import { useState, useMemo } from "react";
import { Note } from "../../definitions";
import Link from "next/link";

function constructLongDateTooltip(date: Date) {
    const dateComponents = date.toDateString().split(' ');
    dateComponents.shift();

    const timeComponents = date.toLocaleTimeString().split(':');
    timeComponents.splice(timeComponents.length - 1);

    const datePart = dateComponents.join(', ');
    const timePart = 'at ' + timeComponents.join(':');
    
    return datePart + ', ' + timePart;
}

export default function NoteCard({ note }: { note: Note }) {
    const [isHovered, setIsHovered] = useState(false);

    const dateComponents = note.last_modified.toString().split(' ');
    const shortDate = [dateComponents[1], dateComponents[2]].join(' ');
    const longDate = useMemo(() => constructLongDateTooltip(note.last_modified), [note.last_modified]);
    
    return (
        <Link href={`/notes/${note.id}`} className="hover:cursor-pointer hover:outline-1 outline-gray-600 flex flex-col bg-gray-800 p-3.5 rounded-2xl shadow-2xl h-32 justify-end">
            <div className="relative flex flex-col h-0.7">
                <p className="mb-5">{note.title}</p>
                <div onPointerOver={() => setIsHovered(true)} onPointerLeave={() => setIsHovered(false)} className="text-gray-500 flex flex-row gap-1">
                    <div className="bg-red-400 rounded-full w-5 h-5 p-0 m-0 leading-5 text-center text-white text-xs">P</div>
                    <aside>{shortDate}</aside>
                </div>

                {isHovered &&
                    <div className="p-2 m-0 shadow-2xl bg-gray-800 rounded-2xl w-max absolute top-20">
                        <p className="text-sm">Last edited by John Doe</p>
                        <small className="text-gray-500">{longDate}</small>
                    </div>
                }
            </div>
        </Link>
    )
}