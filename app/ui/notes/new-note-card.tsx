"use client";
import { PlusIcon } from "@heroicons/react/16/solid";
import { CreateNote } from "./create-note";
import { startTransition, useState } from "react";

export function NewNote() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="w-[8rem] hover:cursor-pointer hover:scale-105 transition-[scale] flex h-32 justify-center hover:outline-1 outline-gray-600 bg-gray-800 p-2.5 rounded-2xl shadow-2xl" type="button">
                <PlusIcon className="w-10"/>
            </button>
            <CreateNote isOpen={isOpen} handleClose={() => setIsOpen(false)}/>
        </>
    )
}