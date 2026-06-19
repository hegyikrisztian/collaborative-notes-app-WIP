import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="bg-gray-900 px-100 flex flex-col gap-6 justify-center items-center fixed backdrop-blur-2xl top-0 left-0 h-screen w-screen">
            {children}
        </main>
    );
}
 
export default Layout;