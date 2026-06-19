import { v4 as uuid } from "uuid";
import postgres from "postgres";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySession } from "@/app/lib/session";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CreateNoteSchema = z.object({
    title: z.string()
})

export async function POST(request: Request) {
    let id;
    try {
        const session = await verifySession();

        if (!session)
            redirect('/login');

        const body = await request.json();  // TBD logged user
        console.log(body);
        if (!body) {
            return NextResponse.json({ message: 'Provide body' }, { status: 400 });
        }
        const { title } = CreateNoteSchema.parse({
            title: body?.title
        });
        
        id = uuid();
        await sql`
            INSERT INTO notes (id, title, content, last_modified, creator)
            VALUES (${id}, ${title}, 'Start today...', ${new Date(Date.now())}, ${session.userId as string})
        `;
        
        return NextResponse.json({ id }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating Note' }, { status: 500 });
    }
}