"use client";
import { ReactNode, RefObject } from "react";

type DialogProps = {
    children: ReactNode,
    ref: RefObject<HTMLDialogElement | null>
}

export const Dialog = ({ children, ref }: DialogProps) => {
    return ( 
        <dialog ref={ref} className="p-0 m-0 bg-transparent open:h-screen backdrop-blur-lg overflow-hidden open:w-screen open:flex open:items-center open:justify-center open:text-white">
            {children}
        </dialog>
    );
}

Dialog.Actions = ({ children }: Pick<DialogProps, 'children'>) => {
    return (
        <div className="flex flex-row self-end gap-3">
            {children}
        </div>
    );
}
