"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { authClient } from "@/lib/auth-client";

import type { Profile } from "@/actions/getProfileOfUser";
import type { pinnedSelectReturn } from "@/lib/types";

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

import {
    LuLayoutGrid,
    LuCirclePlus,
    LuChevronsUpDown,
    LuLogOut,
    LuSettings,
    LuUser,
    LuUserSearch,
} from "react-icons/lu";
import uuidToShort from "@/lib/uuidToShort";

import DashboardPinnedItem from "@/components/custom/dashboardPinnedItem";

export function AppSidebar({ profile, pinned }: { profile: Profile; pinned: pinnedSelectReturn }) {
    const shortUserId = uuidToShort(profile?.profileId || "");
    const router = useRouter();

    const t = useTranslations("sidebar");

    async function handleLogout() {
        await authClient.signOut();
        router.push("/");
    }

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
                                <Link href="/app/dashboard/create">
                                    <LuCirclePlus />
                                    {t("newDashboard")}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/app/search">
                                    <LuUserSearch />
                                    Find users
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("pinned")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col gap-1">
                            {pinned.map((dashboard) => {
                                const isOwner = dashboard.ownerId === profile?.profileId;

                                return (
                                    <DashboardPinnedItem
                                        key={dashboard.dashboardId}
                                        dashboard={dashboard}
                                        isOwner={isOwner}
                                    />
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
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
                                            {profile?.icon || "👤"}
                                        </span>
                                        <span>{profile?.username}</span>
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
                                    <Link href="/app/settings">
                                        <LuSettings size={16} />
                                        <span>{t("settings")}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
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
