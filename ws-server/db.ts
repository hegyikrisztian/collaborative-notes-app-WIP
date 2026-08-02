import postgres from "postgres";
import { Note, User } from "./definitions";

export class DB {
    static instance: DB;
    static sql: postgres.Sql

    constructor() {
        
        if (DB.instance) {
            return DB.instance;
        }

        DB.instance = this;
        DB.sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', prepare: false, keep_alive: 1 });
    }
    
    public async updateNoteContent(noteId: string, content: string) {
        try {
            await DB.sql`update notes set content = ${content} where id = ${noteId}`;
            return true
        }
        catch (error) {
            console.error(error)
            return false
        }
    }

    public async getNoteContent(noteId: string) {
        try {
            const rows = await DB.sql<Note[]>`select * from notes where id = ${noteId}`;
            if (!rows.length)
                throw new Error(`No note with id ${noteId}`);

            return rows[0];
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public async getUsers(userIds: string[]) {
        try {
            if (!userIds.length)
                throw new Error('Provide userIds for getUserNames');

            const rows = await DB.sql<User[]>`select * from users where id in (${userIds.join(', ')})`;
            return rows;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
}