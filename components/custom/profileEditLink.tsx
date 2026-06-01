"use client";

import Link from "next/link";
import { useState } from "react";

import { LuPencil, LuLoaderCircle } from "react-icons/lu";

export default function ProfileEditLink({ id, label }: { id: string; label: string }) {
    const [loading, setLoading] = useState(false);

    return (
        <Link
            className="flex flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-4 py-2 text-neutral-500 shadow hover:border-amber-300 hover:bg-amber-200 hover:text-amber-500 hover:shadow-amber-200"
            href={`/app/profile/${id}/edit`}
            onNavigate={() => setLoading(true)}
        >
            {loading ? <LuLoaderCircle className="animate-spin" /> : <LuPencil />}
            <span className="text-sm md:text-base">{label}</span>
        </Link>
    );
}
