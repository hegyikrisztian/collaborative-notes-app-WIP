import AddUsersModal from "./modals/add-users-note";
import { DeleteNote } from "./buttons/note-delete";

export const NoteActions = ({ id }: { id: string }) => {
    return (
        <>
            <div className="flex flex-row gap-3">
                <AddUsersModal noteId={id}/>
                <DeleteNote id={id}/>
            </div>
        </>
    );
}