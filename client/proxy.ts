import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "./app/lib/session";


export async function proxy(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value;
    const session = await verifySessionCookie(sessionCookie);

    if (!session)
        return NextResponse.redirect(new URL('/login', request.url));

    if (!session.userId)
        return NextResponse.redirect(new URL('/login', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ["/notes/:paths*"]
}