"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { notoColorEmoji } from "@/lib/fonts";

import { LuLayoutGrid, LuCirclePlus, LuChevronsUpDown, LuLogOut, LuSettings, LuUser } from "react-icons/lu";
import uuidToShort from "@/lib/uuidToShort";

export function AppSidebar() {
    const userId = "160f1377-e313-4e5d-b77a-7b2a07079120";
    const shortUserId = uuidToShort(userId);

    const t = useTranslations("sidebar");

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="bg-blue-600 font-semibold text-white hover:bg-blue-700 hover:text-white active:bg-blue-800 active:text-white"
                        >
                            <Link href="/app/">
                                <LuLayoutGrid />
                                <span>{t("allDashboards")}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <button>
                                    <LuCirclePlus />
                                    {t("newDashboard")}
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("pinned")}</SidebarGroupLabel>
                    <SidebarGroupContent></SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="flex flex-row justify-between">
                                    <div className="flex flex-row items-center">
                                        <span
                                            className={`${notoColorEmoji.className} -translate-x-1 text-xl select-none`}
                                            role="img"
                                            aria-label="Profile Picture"
                                        >
                                            &#129315;
                                        </span>
                                        <span>John Doe</span>
                                    </div>
                                    <LuChevronsUpDown size={16} />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-40">
                                <DropdownMenuItem asChild>
                                    <Link href={`/app/profile/${shortUserId}`}>
                                        <LuUser size={16} />
                                        <span>{t("profile")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <LuSettings size={16} />
                                        <span>{t("settings")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                    <LuLogOut size={16} />
                                    <span>{t("logout")}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
