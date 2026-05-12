"use client";
import Link from "next/link";
import { useState } from "react";

import { useTranslations } from "next-intl";

import { notoColorEmoji } from "@/lib/fonts";

import { LuEllipsis, LuChevronRight, LuTrash2, LuSquarePen, LuPin } from "react-icons/lu";

import uuidToShort from "@/lib/uuidToShort";
import toStandardTime from "@/lib/toStandardTime";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function DashboardListItem({
    title,
    editedAt,
    username,
    id,
    createdAt,
    icon,
}: {
    title: string;
    editedAt: string | null;
    username: string;
    id: string;
    createdAt: string | null;
    icon: string;
}) {
    const [linkHovered, setLinkHovered] = useState(false);
    const t = useTranslations("component.dashboardCard");

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
                                aria-label={t("icon")}
                            >
                                {icon}
                            </span>
                            <h2 className="text-xl font-semibold">{title}</h2>
                        </div>
                        <span className="text-sm text-neutral-500">
                            {t("by")} {username}
                        </span>
                    </div>
                    <span className="text-sm text-neutral-500">
                        {t("lastEdited")} {editedAt ? toStandardTime(editedAt) : toStandardTime(createdAt ?? "")}
                    </span>
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
                                {t("options")}
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-48">
                            <DropdownMenuItem>
                                <LuPin size={16} />
                                <span>{t("pin")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LuSquarePen size={16} />
                                <span>{t("rename")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                                <LuTrash2 size={16} />
                                <span>{t("delete")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                                {t("created")} {toStandardTime(createdAt ?? "")}
                            </DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Link
                className="group flex h-full flex-row items-center justify-center border-l border-neutral-300 px-2 hover:border-neutral-600/50 focus-visible:border-neutral-600/50"
                href={`/app/dashboard/${uuidToShort(id)}`}
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
                    {t("open")}
                </span>
            </Link>
        </div>
    );
}
