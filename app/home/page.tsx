"use client";
import { Bitcount_Grid_Double } from "next/font/google";
import { useEffect, useRef } from "react";

const bitcountGrid = Bitcount_Grid_Double({
  subsets: ["latin"],
});

const title = 'Notes';

export default function Home() {
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        const container = titleRef.current
        if (!container) return

        // Already on screen
        if (container.childNodes.length) return

        // Get letters
        const letters = title.split('');

        let delay = 100
        for (const letter of letters) {
            const span = document.createElement('span');
            span.textContent = letter;
            container.appendChild(span);
            span.classList.add('split-text');

            span.style.cssText += `--split-text-stagger: ${delay}ms;`
            delay+=100
        }

        titleRef.current = null
    }, [titleRef.current])

    return (
        <main className="flex flex-col justify-center items-center bg-gray-900 p-0 m-auto h-full w-full">
            <div ref={titleRef} className={`${bitcountGrid.className} text-9xl`}>
                {/* Render split text here */}
            </div>
        </main>
    )
}