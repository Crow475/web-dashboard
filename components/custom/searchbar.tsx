"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LuSearch } from "react-icons/lu";

export default function Searchbar({
    defaultValue,
    placeholder,
    buttonText,
}: {
    defaultValue: string;
    placeholder: string;
    buttonText: string;
}) {
    const router = useRouter();
    const [query, setQuery] = useState(defaultValue);

    return (
        <form
            className="flex w-[90%] flex-row items-center justify-center space-x-2 px-2 py-4 md:w-3/4"
            onSubmit={(e) => {
                e.preventDefault();
                router.push(`/app/search?query=${query}`);
            }}
        >
            <input
                type="text"
                className="w-full rounded-md border border-neutral-200 px-2 py-2 text-sm shadow md:px-3 md:text-base"
                placeholder={placeholder}
                autoComplete="off"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />
            <button
                className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2.5 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm"
                type="submit"
            >
                <span className="hidden md:block">{buttonText}</span>
                <LuSearch className="size-4 md:size-5" />
            </button>
        </form>
    );
}
