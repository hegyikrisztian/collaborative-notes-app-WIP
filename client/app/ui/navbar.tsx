"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar({ isAuthenticated }: { isAuthenticated: boolean }) {
    const pathname = usePathname();
    const activeClass = "underline underline-offset-10"
    return (
        <nav className="shadow-2xl bg-gray-800 rounded-full mt-3 ms-3 w-fit">
            <ol className="flex gap-20 px-10 py-5">
                <li className={pathname === '/' ? activeClass : ''}>
                    <Link href={'/'}>Home</Link>
                </li>
                {isAuthenticated ? 
                    <li className={pathname?.includes('/notes') ? activeClass : ''}>
                        <Link href='/notes'>My notes</Link>
                    </li>
                    :
                    null
                }
            </ol>
        </nav>
    )
}