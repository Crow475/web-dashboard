"use client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";

import { LuGlobe } from "react-icons/lu";

export default function LanguageSelector({ localeChangeHandler }: { localeChangeHandler: (locale: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="absolute bottom-10 z-10 rounded-full bg-white p-2 shadow">
                <LuGlobe />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="-translate-x-10">
                <DropdownMenuItem onSelect={() => localeChangeHandler("en")}>
                    <span>🇬🇧</span>
                    <span>English</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => localeChangeHandler("ru")}>
                    <span>🇷🇺</span>
                    <span>Русский</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
