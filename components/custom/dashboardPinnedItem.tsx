"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import type { pinnedSelectReturn } from "@/lib/types";
import uuidToShort from "@/lib/uuidToShort";

import { LuEllipsis, LuPinOff, LuLink, LuTrash2, LuLogOut, LuPin } from "react-icons/lu";

import { notoColorEmoji } from "@/lib/fonts";

import deleteFromPinned from "@/actions/deleteFromPinned";
import addToPinned from "@/actions/addToPinned";
import getPinned from "@/actions/getPinned";

import { useTranslations } from "next-intl";

import DeleteDialog from "@/components/custom/deleteDialog";
import LeaveDialog from "@/components/custom/leaveDialog";

export default function DashboardPinnedItem({
    dashboard,
    isOwner,
}: {
    dashboard: pinnedSelectReturn[0];
    isOwner: boolean;
}) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const router = useRouter();
    const t = useTranslations("component.dashboardCard");

    useEffect(() => {
        const getIsPinned = async () => {
            const result = await getPinned();

            if (result) {
                const pinnedDashboards = result.map((dashboard) => dashboard.dashboardId);

                if (pinnedDashboards.includes(dashboard.dashboardId)) {
                    setIsPinned(true);
                }
            }
        };

        getIsPinned();
    });

    async function handlePin() {
        const result = await addToPinned(dashboard.dashboardId);
        if (result) {
            router.refresh();
            setIsPinned(true);
        }
    }

    async function handleUnpin() {
        const result = await deleteFromPinned(dashboard.dashboardId);
        if (result) {
            router.refresh();
            setIsPinned(false);
        }
    }

    return (
        <>
            <SidebarMenuItem key={dashboard.dashboardId}>
                <SidebarMenuButton asChild>
                    <Link
                        href={`/app/dashboard/${uuidToShort(dashboard.dashboardId)}`}
                        className="flex w-full flex-row items-center justify-start rounded-md border border-neutral-300 py-1 shadow hover:bg-neutral-100 hover:text-neutral-600 focus-visible:bg-neutral-100 focus-visible:text-neutral-600"
                    >
                        <span
                            className={`${notoColorEmoji.className} text-xs select-none`}
                            role="img"
                            aria-label="Dashboard Icon"
                        >
                            {dashboard.icon || "📊"}
                        </span>
                        <span>{dashboard.title}</span>
                    </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                            <LuEllipsis size={16} />
                        </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-48">
                        {isPinned ? (
                            <DropdownMenuItem onSelect={() => handleUnpin()}>
                                <LuPinOff size={16} />
                                <span>unpin</span>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onSelect={() => handlePin()}>
                                <LuPin size={16} />
                                <span>{t("pin")}</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onSelect={() => {
                                navigator.clipboard.writeText(
                                    `${window.location.origin}/app/dashboard/${uuidToShort(dashboard.dashboardId)}`,
                                );
                                toast.success(t("copied"));
                            }}
                        >
                            <LuLink size={16} />
                            <span>{t("copy")}</span>
                        </DropdownMenuItem>
                        {isOwner ? (
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => {
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                <LuTrash2 size={16} />
                                <span>{t("delete")}</span>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => {
                                    setLeaveDialogOpen(true);
                                }}
                            >
                                <LuLogOut size={16} />
                                <span>{t("leave")}</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => setDeleteDialogOpen(open)}
                id={dashboard.dashboardId}
                title={dashboard.title}
                icon={dashboard.icon || "📊"}
            />
            <LeaveDialog
                open={leaveDialogOpen}
                onOpenChange={(open) => setLeaveDialogOpen(open)}
                id={dashboard.dashboardId}
            />
        </>
    );
}
