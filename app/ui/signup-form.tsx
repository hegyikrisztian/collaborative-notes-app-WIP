"use client";
import { useActionState } from "react";
import { signup } from "../lib/actions/auth";
import { UserIcon, KeyIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";

export const SignupForm = () => {
    const [state, signupAction, pending] = useActionState(signup, undefined);

    return (
        <form className="flex flex-col gap-5 w-full outline-1 outline-gray-600 rounded-2xl p-10 shadow-2xl max-w-2xl" action={signupAction}>
            <fieldset className="relative flex flex-col gap-2 ">
                <label htmlFor="username">Username</label>
                <div className="flex items-center border border-gray-600 rounded-md">
                    <span className="px-0 border-r-2 border-gray-600">
                        <UserIcon className="w-5 mx-4 text-gray-500"/>
                    </span>
                    <input autoComplete="username" className="focus:outline-red w-full p-3" type="text" name="username" id="username" placeholder="Username..." />
                </div>
                {state?.errors.properties?.username && 
                    <p className="flex gap-0.5 text-sm text-red-500 italic">
                        <ExclamationCircleIcon className="w-5" />
                        {state?.errors.properties?.username.errors}
                    </p>
                }
            </fieldset>
            <fieldset className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <div className="flex items-center border border-gray-600 rounded-md">
                    <span className="px-0 border-r-2 border-gray-600">
                        <KeyIcon className="w-5 mx-4 text-gray-500"/>
                    </span>
                    <input autoComplete="current-password" className="w-full p-3" type="password" name="password" id="password" placeholder="Password..." />
                </div>
                {state?.errors.properties?.password && 
                    <div className="flex flex-col gap-0.5 text-sm text-red-500 italic">
                        {state?.errors.properties?.password.errors.map((error, i) => <p className="flex gap-0.5" key={i}><ExclamationCircleIcon className="w-5" /> {error}</p>)}
                    </div>}
            </fieldset>

            <button className="flex self-end gap-2 disabled:opacity-50 rounded-full px-4 py-2 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md" disabled={pending} type="submit">Signup</button>
        </form>
    );
}