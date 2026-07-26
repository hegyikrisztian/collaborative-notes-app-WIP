'use server';

import { redirect } from "next/navigation";
import { SignupFormSchema, SignupFormState, LoginFormState, LoginFormSchema } from "../definitions";
import { z } from 'zod';
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { v4 as uuid } from "uuid";
import { createSession, deleteSession } from "../session";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function signup(state: SignupFormState, formData: FormData) {
    try {
        const validatedFields = SignupFormSchema.safeParse({
            username: formData.get('username'),
            password: formData.get('password')
        });

        if (!validatedFields.success) {
            return {
                errors: z.treeifyError(validatedFields.error)
            };
        }
        const { data } = validatedFields;
        const hashedPassword = await bcrypt.hash(data.password, 10)

        await sql`
            insert into users (id, name, password)
            values (${uuid()}, ${data.username}, ${hashedPassword})
        `;

    }
    catch (error) {
        console.error(error);
        throw new Error(`DB error in signup ${error}`);
    }
    
    redirect('/login')
}

export async function login(state: LoginFormState, formData: FormData) {
    try {
        const validatedFields = LoginFormSchema.safeParse({
            username: formData.get('username'),
            password: formData.get('password')
        });
        if (!validatedFields.success) {
            return {
                errors: z.treeifyError(validatedFields.error)
            };
        }
        const { data } = validatedFields;

        const row = await sql`
            select * from users where name = ${data.username}
        `;

        const user = row[0];
        if (!user) {
            return {
                errors: {
                    errors: ['Invalid username or password.']
                }
            };
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return {
                errors: {
                    errors: ['Invalid username or password.']
                }
            };
        }

        // set session
        await createSession(user.id);
    }
    catch (error) {
        console.error(error);
        throw new Error(`DB error in login ${error}`);
    }

    redirect('/notes');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
