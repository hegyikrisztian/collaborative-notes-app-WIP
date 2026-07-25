import { useEffect, useState } from "react"
import { User } from "../lib/definitions";

export default function useFetchUsers(query: string = '') {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            try {
                const sanitizedQuery = query.trim().toLowerCase();
                if (sanitizedQuery.length < 3) {
                    console.warn('Provide at least 3 characters in the query');
                    return [];
                }
                const response = await fetch(`/api/users?query=${sanitizedQuery}`);
                if (response.status !== 200) {
                    console.warn('Error fetching users');
                    return [];
                }
    
                const users = await response.json();
                setUsers(users.users);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }

        const id = setTimeout(() => fetchUsers(), 500);

        return () => clearTimeout(id);
    }, [query])

    return { users: users || [], loading };
}