import { User } from "@/app/lib/definitions";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const query = url.searchParams.get('query');

        if (!query)
            throw new Error('Provide query for get users');
        
        if (query.length < 3)
            throw new Error('query must be at least 3 characters long');
        
        const sanitizedQuery = query.trim();
        const users = await sql<User[]>`select id, name from users where name ilike ${'%' + sanitizedQuery + '%'}`;

        return Response.json({ users });
    }
    catch (error) {
        console.error(`Error in fetching users: ${error}`);
        throw new Error(`Error in fetching users: ${error}`);
    }
}