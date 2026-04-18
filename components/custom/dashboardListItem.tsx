import { notoColorEmoji } from "@/lib/fonts";

import Link from "next/link";

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
    return (
        <div className="col-span-1 flex flex-row items-center justify-around rounded-2xl border border-neutral-300 py-3 ps-3 shadow">
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
                        <DropdownMenuTrigger className="flex cursor-pointer flex-row items-center justify-center rounded-full bg-neutral-100 px-2 py-2 text-neutral-500 shadow">
                            <LuEllipsis size={20} />
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
                            <DropdownMenuItem className="text-red-700">
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
                className="flex h-full flex-row items-center justify-center border-l border-neutral-300 px-2"
                href="/dashboard/"
            >
                <LuChevronRight size={30} className="text-neutral-400" />
            </Link>
        </div>
    );
}
