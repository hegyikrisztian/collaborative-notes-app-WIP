import { useEffect, useState } from "react"
import { User } from "../lib/definitions";

export default function useFetchUsers(query: string = '') {
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        async function fetchUsers() {
            if (query.length < 3) {
                console.warn('Provide at least 3 characters in the query');
                return [];
            }
            const response = await fetch(`/api/users?query=${query}`);
            const users = await response.json();
            setUsers(users.users);
        }

        const id = setTimeout(() => fetchUsers(), 500);

        return () => clearTimeout(id);
    }, [query])

    return users
}