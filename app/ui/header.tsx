import { verifySession } from "../lib/session";
import LoginLogoutButton from "./buttons/login-logout-button";
import NavBar from "./navbar";

export default async function Header() {
    const { isAuthenticated } = await verifySession();
    return (
        <main className="header-transition w-screen">
            <NavBar isAuthenticated={isAuthenticated}/>
            <span className="absolute top-5 right-10 mt-3">
                <LoginLogoutButton />
            </span>
        </main>
    )
}