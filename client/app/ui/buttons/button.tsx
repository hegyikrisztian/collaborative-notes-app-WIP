import { ComponentProps } from "react";

export const mainButtonClassName = "flex self-end gap-2 disabled:opacity-50 rounded-full px-4 py-2.5 text-black bg-blue-50 not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md";
export const secondaryButtonClassName = "flex self-end gap-2 disabled:opacity-50 rounded-full px-4 py-2.5 text-blue-50 border-blue-50 border not-disabled:cursor-pointer hover:not-disabled:scale-105 transition-[scale] text-md";

export const MainButton = (props: ComponentProps<'button'>) => {
    const { children, ...rest } = props; 
    return (
        <button
            className={mainButtonClassName}
            {...rest}
        >
            {children}
        </button>
    )
}

export const SecondaryButton = (props: ComponentProps<'button'>) => {
    const { children, ...rest } = props; 
    return (
        <button
            className={secondaryButtonClassName}
            {...rest}
        >
            {children}
        </button>
    )
}

export const ErrorIconButton = (props: ComponentProps<'button'>) => {
    const { children, ...rest } = props; 
    return (
        <button {...rest} className="border border-[#e31200] rounded-full cursor-pointer p-2.5 hover:not-disabled:scale-105 transition-[scale]">
            {children}
        </button>
    )

}
export const ToolbarButton = (props: ComponentProps<'button'>) => {
    const { children, ...rest } = props; 
    return (
        <button {...rest} className="hover:bg-gray-800 transition-[background] rounded-sm cursor-pointer px-1.5 w-[2rem]">
            {children}
        </button>
    )
}