"use client";
import Link from "next/link";
import { useState } from "react";

import { notoColorEmoji } from "@/lib/fonts";

import { LuEllipsis, LuChevronRight, LuTrash2, LuSquarePen, LuPin } from "react-icons/lu";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function DashboardListItem() {
    const [linkHovered, setLinkHovered] = useState(false);

    return (
        <div
            className={`col-span-1 flex flex-row items-center justify-around rounded-2xl border border-neutral-300 py-3 ps-3 shadow ${linkHovered ? "border-r-blue-200 bg-linear-to-l from-blue-300 via-blue-100 via-30% to-white to-60%" : "bg-white"}`}
        >
            <div className="flex w-11/12 flex-row space-x-3 pr-2">
                <div className="flex w-11/12 flex-col items-start justify-between space-y-2">
                    <div className="flex w-full flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-2">
                            <span
                                className={`${notoColorEmoji.className} text-4xl select-none`}
                                role="img"
                                aria-label="Dashboard icon"
                            >
                                &#129315;
                            </span>
                            <h2 className="text-xl font-semibold">Not my Dashboard</h2>
                        </div>
                        <span className="text-sm text-neutral-500">by John Doe</span>
                    </div>
                    <span className="text-sm text-neutral-500">Last edited 30.09.2025</span>
                    <div className="flex w-full flex-row items-center justify-between space-x-2"></div>
                </div>
                <div className="flex flex-row items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="flex cursor-pointer flex-row items-center justify-center rounded-full bg-neutral-100 px-2 py-2 text-neutral-500 shadow hover:bg-neutral-200 hover:text-neutral-600 focus-visible:bg-neutral-200 focus-visible:text-neutral-600"
                            aria-labelledby="dashboard-options"
                        >
                            <LuEllipsis size={20} />
                            <span className="sr-only" id="dashboard-options">
                                Options
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-40">
                            <DropdownMenuItem>
                                <LuPin size={16} />
                                <span>Pin to sidebar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LuSquarePen size={16} />
                                <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                                <LuTrash2 size={16} />
                                <span>Delete</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Created: 10.10.2024</DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Link
                className="group flex h-full flex-row items-center justify-center border-l border-neutral-300 px-2 hover:border-neutral-600/50 focus-visible:border-neutral-600/50"
                href="/app/dashboard/"
                aria-labelledby="open-dashboard"
                onMouseEnter={() => setLinkHovered(true)}
                onMouseLeave={() => setLinkHovered(false)}
                onFocus={() => setLinkHovered(true)}
                onBlur={() => setLinkHovered(false)}
            >
                <LuChevronRight
                    size={30}
                    className="text-neutral-400 group-hover:text-neutral-600/50 group-focus-visible:text-neutral-600/50"
                />
                <span className="sr-only" id="open-dashboard">
                    Open dashboard
                </span>
            </Link>
        </div>
    );
}
