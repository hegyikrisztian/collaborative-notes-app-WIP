import Link from "next/link";
import { mainButtonClassName, secondaryButtonClassName } from "./ui/buttons/button";
import { verifySession } from "./lib/session";
import { ViewTransition } from "react";


const LandingPage = async () => {
    const { isAuthenticated } = await verifySession();

    return (
        <ViewTransition enter='slide-up' exit='slide-down'>
            <main className="flex flex-col justify-center items-center bg-gray-900 p-0 m-auto h-full w-full">
                <div className="flex flex-col justify-center w-[50%] items-start gap-2.5 bg-gray-900 p-0 m-auto h-full">
                    <h1 className={`leading-18.75 m-0 text-9xl uppercase`}>
                        Notes
                    </h1>
                    <article>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis tenetur ducimus consequuntur sit at qui doloremque earum quas animi illo fugiat corporis dolores maxime, ipsa expedita amet magnam doloribus velit!</article>
                    {!isAuthenticated && 
                        <div className="flex gap-5 items-center">
                            <Link className={mainButtonClassName} href={'/signup'}>Signup</Link>
                            <span>or</span>
                            <Link className={secondaryButtonClassName} href={'/login'}>Login</Link>
                        </div>
                    }
                </div>
            </main>
        </ViewTransition>
    );
}

export default LandingPage;