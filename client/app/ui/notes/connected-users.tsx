import useNoteEditContext from "@/app/contexts/useNoteEditContext";
import { User } from "@/app/lib/definitions";


function randomColor() {
    const h = Math.floor(Math.random() * 360);
    const w = Math.floor(Math.random() * 100);
    return `hwb(${h}deg ${w}% 40%)`;
}

const ConnectedUser = ({ user }: { user: User }) => {
    const { userId } = useNoteEditContext();
    const color = randomColor();
    const initial = user.name[0].toUpperCase();

    return <li style={{ backgroundColor: color, outlineOffset: '2px', outline: userId === user.id ? `2px solid ${color}` : '' }} className={`w-5 h-5 rounded-full shadow-2xl p-0 m-0 leading-5 text-center text-xs`}>{initial}</li>
}

export const ConnectedUsers = ({ users }: { users: User[] }) => {
    if (!users.length)
        return null;

    return ( 
         <ul className="flex flex-row gap-2">
            {users.map((u, i) => <ConnectedUser key={`${u} - ${i}`} user={u} />)}
        </ul>
    );
}