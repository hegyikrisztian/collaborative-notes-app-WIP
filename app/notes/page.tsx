import { Suspense, ViewTransition } from "react";
import NoteListSkeleton from "../ui/skeletons/note-list-skeleton";
import NoteList from "../ui/notes/note-list";

export default async function Page() {
    return (
        <>
            <div className="grid grid-cols-3 gap-5">
               <Suspense fallback={
                    <ViewTransition exit='slide-down'>
                        <NoteListSkeleton />
                    </ViewTransition>
                }>
                    <ViewTransition enter='slide-up'>
                        <NoteList />
                    </ViewTransition>
               </Suspense>
            </div>
        </>
    )
}