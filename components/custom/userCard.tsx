"use client";

import { notoColorEmoji } from "@/lib/fonts";

import type { dashboardUserSelectReturn } from "@/lib/types";

import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";

import { useTranslations } from "next-intl";

export default function UserCard({
    profile,
    setCurrentUsers,
    currentUsers,
}: {
    profile: dashboardUserSelectReturn[0];
    setCurrentUsers: (users: dashboardUserSelectReturn) => void;
    currentUsers: dashboardUserSelectReturn;
}) {
    const t = useTranslations("editDashboard.addUserDialog");

    function handleRoleChange(value: "viewer" | "editor" | "admin") {
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

    return (
        <div className="flex w-full flex-row items-center justify-between rounded-md border border-neutral-200 px-3 py-2 shadow">
            <div className="flex flex-row items-center justify-start space-x-2">
                <div className={`${notoColorEmoji.className} text-xl`}>{profile.profile?.icon}</div>
                <span className="line-clamp-1 text-lg font-semibold">{profile.profile?.username}</span>
            </div>
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
        </div>
    );
}
