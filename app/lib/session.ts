import 'server-only';

import { jwtVerify, SignJWT } from "jose";
import { SessionPayload } from "./definitions";
import { cookies } from "next/headers";
import { cache } from 'react';

const secret = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secret);

async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(encodedKey);
}

async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256']
        })
        return payload
    }
    catch (error) {
        console.error('Error in JWT decrypt', error)
    }
}

export async function verifySessionCookie(cookie: string | undefined) {
    if (!cookie)
        return { isAuthenticated: false, userId: undefined }

    const session = await decrypt(cookie);
    if (!session?.userId)
        return { isAuthenticated: false, userId: undefined }

    return { isAuthenticated: true, userId: session.userId }
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        secure: true,
        expires: expiresAt,
        httpOnly: true,
        sameSite: 'lax',
    })
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export const verifySession = cache(async () => {
    const cookieStore = await cookies();
    
    const cookie = cookieStore.get('session')?.value
    return verifySessionCookie(cookie)
})