"use client";

import Link from "next/link";
import { useState } from "react";

import { LuRocket, LuLoaderCircle } from "react-icons/lu";

export default function StartButton({ label }: { label: string }) {
    const [loading, setLoading] = useState(false);

    return (
        <Link
            className="data-disabled:pointer-none col-span-1 flex flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-sm text-white shadow hover:bg-blue-600 data-disabled:border-blue-200 data-disabled:bg-blue-300 data-disabled:hover:bg-blue-300 md:text-base"
            href="/app/"
            onNavigate={() => setLoading(true)}
            data-disabled={loading}
        >
            <span>{label}</span>
            {loading ? <LuLoaderCircle className="animate-spin" /> : <LuRocket />}
        </Link>
    );
}
