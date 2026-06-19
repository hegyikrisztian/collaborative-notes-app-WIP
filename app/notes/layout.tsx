import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col justify-center items-center bg-gray-900 p-0 m-auto h-full w-full">
            {children}
        </div>
    );
}
 
export default Layout;