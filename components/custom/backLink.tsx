import Link from "next/link";
import { LuMoveLeft } from "react-icons/lu";

export default function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="absolute top-5 left-5 z-10 flex flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm"
        >
            <LuMoveLeft />
            <span>{label}</span>
        </Link>
    );
}
