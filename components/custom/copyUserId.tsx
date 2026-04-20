"use client";

import { useState } from "react";

import { LuCopy, LuCheck } from "react-icons/lu";

export default function CopyUserId({ userId }: { userId: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(userId);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <button
            className="flex cursor-pointer flex-row items-center justify-start space-x-1 rounded-md bg-neutral-100 px-2 py-1 text-sm text-neutral-500"
            onClick={handleCopy}
        >
            {copied ? <LuCheck /> : <LuCopy />}
            <code>{userId}</code>
        </button>
    );
}
