"use client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";

import { LuGlobe } from "react-icons/lu";

import { notoColorEmoji } from "@/lib/fonts";

export default function LanguageSelector({ localeChangeHandler }: { localeChangeHandler: (locale: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="absolute bottom-10 z-10 flex cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow hover:bg-neutral-100">
                <LuGlobe />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="-translate-x-10">
                <DropdownMenuItem onSelect={() => localeChangeHandler("en")}>
                    <span className={notoColorEmoji.className}>🇬🇧</span>
                    <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => localeChangeHandler("ru")}>
                    <span className={notoColorEmoji.className}>🇷🇺</span>
                    <span>Русский</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
