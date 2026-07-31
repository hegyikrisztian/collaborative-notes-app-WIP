import AddUsersModal from "./modals/add-users-note";
import { DeleteNote } from "./buttons/note-delete";
import { LiveLoadingIndicator } from "./live-loading-indicator";

export const NoteActions = ({ noteId, isSaving }: { noteId: string, isSaving: boolean }) => {
    return (
        <>
            <div className="flex flex-row gap-3 items-center">
                <LiveLoadingIndicator isLoading={isSaving}/>
                <AddUsersModal noteId={noteId}/>
                <DeleteNote noteId={noteId}/>
            </div>
        </>
    );
}