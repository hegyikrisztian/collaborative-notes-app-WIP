import Link from "next/link";
import { Breadcrumb } from "../definitions";

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
    return (
        <nav>
            <ol className="flex gap-3.5">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li className={`flex gap-3.5 ${breadcrumb.active ? 'text-blue-50' : 'text-gray-400'}`} key={index}>
                        <Link href={breadcrumb.href}>{breadcrumb.name}</Link>
                        {index < breadcrumbs.length - 1 && <span>/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    )
}