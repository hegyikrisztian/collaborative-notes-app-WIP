import { logout } from "@/app/lib/actions/auth";
import { verifySession } from "@/app/lib/session";
import Link from "next/link";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/16/solid";

export default async function LoginLogoutButton() {
    const { isAuthenticated } = await verifySession();

    if (isAuthenticated)
        return (
            <button className="flex gap-2 disabled:opacity-50 rounded-full px-4 text-blue-50 border-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale]" type="button" onClick={logout}>
                <ArrowLeftEndOnRectangleIcon className="w-5"/>
                Logout
            </button>
        )

    return <Link className="flex gap-2 disabled:opacity-50 rounded-full px-4 py-2.5 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale]" href="/login">Login</Link>
}