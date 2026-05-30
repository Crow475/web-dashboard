"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { dashboardUserSelectReturn } from "@/lib/types";

import { authClient } from "@/lib/auth-client";

import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { useTranslations } from "next-intl";

import { LuTrash2, LuLogOut, LuCircleAlert } from "react-icons/lu";

import { notoColorEmoji } from "@/lib/fonts";

import leaveDashboard from "@/actions/leaveDashboard";

import uuidToShort from "@/lib/uuidToShort";

import { toast } from "sonner";

export default function UserCard({
    profile,
    setCurrentUsers,
    currentUsers,
    setUsersChanged,
}: {
    profile: dashboardUserSelectReturn[0];
    setCurrentUsers: (users: dashboardUserSelectReturn) => void;
    currentUsers: dashboardUserSelectReturn;
    setUsersChanged: (changed: boolean) => void;
}) {
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const { data: session } = authClient.useSession();

    const router = useRouter();

    const t = useTranslations("editDashboard.addUserDialog");
    const t2 = useTranslations("component.leaveDashboardDialog");

    const currentUser = session?.user.id;
    const isCurrentUser = profile.profile?.userId === currentUser;

    function handleRoleChange(value: "viewer" | "editor" | "admin") {
        setUsersChanged(true);
        setCurrentUsers([
            ...currentUsers.filter((user) => user.profile?.profileId !== profile.profile?.profileId),
            {
                profile: {
                    profileId: profile.profile?.profileId ?? "",
                    username: profile.profile?.username ?? "",
                    icon: profile.profile?.icon ?? "",
                    publicEmail: profile.profile?.publicEmail ?? "",
                    userId: profile.profile?.userId ?? "",
                    preferences: null,
                },
                role: value,
                dashboardId: profile.dashboardId,
            },
        ]);
    }

    function handleRemoveUser() {
        setUsersChanged(true);
        setCurrentUsers([...currentUsers.filter((user) => user.profile?.profileId !== profile.profile?.profileId)]);
    }

    async function handleLeaveDashboard() {
        setLeaveDialogOpen(false);
        const result = await leaveDashboard(profile.dashboardId ?? "");

        if (result) {
            router.push("/app/");
        } else {
            toast.error(t2("error"));
        }
    }

    return (
        <HoverCard openDelay={100}>
            <HoverCardTrigger
                className={`flex w-full flex-row items-center justify-between rounded-md border border-neutral-200 px-3 py-2 shadow ${isCurrentUser ? "bg-neutral-100" : "bg-white"}`}
                asChild
            >
                <div>
                    <div className="flex flex-row items-center justify-start space-x-2">
                        <div className={`${notoColorEmoji.className} text-xl`}>{profile.profile?.icon}</div>
                        {isCurrentUser ? (
                            <span className="line-clamp-1 text-lg font-semibold">{profile.profile?.username}</span>
                        ) : (
                            <Link
                                className="line-clamp-1 text-lg font-semibold hover:underline"
                                href={`/app/profile/${uuidToShort(profile.profile?.profileId ?? "")}`}
                            >
                                {profile.profile?.username}
                            </Link>
                        )}
                    </div>
                    {isCurrentUser ? (
                        <span className="text-xs text-neutral-500">{t(profile.role ?? "viewer")}</span>
                    ) : (
                        <Select
                            defaultValue={profile.role ?? ""}
                            onValueChange={(value) => handleRoleChange(value as "viewer" | "editor" | "admin")}
                        >
                            <SelectTrigger className="w-[40%]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="viewer">{t("viewer")}</SelectItem>
                                    <SelectItem value="editor">{t("editor")}</SelectItem>
                                    <SelectItem value="admin">{t("admin")}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </HoverCardTrigger>
            <HoverCardContent side="right" className="flex h-8 w-8 flex-col items-center justify-center">
                {isCurrentUser ? (
                    <button
                        className="flex cursor-pointer rounded-lg border border-neutral-300 bg-white p-2 text-neutral-500 hover:bg-red-300 hover:text-red-950 focus-visible:text-neutral-600"
                        type="button"
                        title={t2("button")}
                        onClick={() => setLeaveDialogOpen(true)}
                    >
                        <LuLogOut className="size-4" />
                    </button>
                ) : (
                    <button
                        className="flex cursor-pointer rounded-lg border border-neutral-300 bg-white p-2 text-neutral-500 hover:bg-red-300 hover:text-red-950 focus-visible:text-neutral-600"
                        type="button"
                        title={t("removeUser")}
                        onClick={handleRemoveUser}
                    >
                        <LuTrash2 className="size-4" />
                    </button>
                )}
            </HoverCardContent>
            <AlertDialog open={leaveDialogOpen} onOpenChange={() => setLeaveDialogOpen(!leaveDialogOpen)}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia>
                            <LuCircleAlert className="text-red-500" />
                        </AlertDialogMedia>
                    </AlertDialogHeader>
                    <AlertDialogTitle className="text-center">{t2("title")}</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">{t2("paragraph")}</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t2("cancel")}</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleLeaveDashboard()}>
                            {t2("leave")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </HoverCard>
    );
}
