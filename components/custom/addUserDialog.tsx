"use client";

import { useState, useActionState } from "react";

import type { dashboardUserSelectReturn } from "@/lib/types";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";

import { LuHash, LuCheck, LuLoaderCircle, LuPlus } from "react-icons/lu";

import { addUser } from "@/actions/addUser";

import { notoColorEmoji } from "@/lib/fonts";

import { toast } from "sonner";

import { useTranslations } from "next-intl";

export default function AddUserDialog({
    opened,
    onOpenChange,
    currentUsers,
    setCurrentUsers,
    dashboardId,
    ownerId,
}: {
    opened: boolean;
    onOpenChange: (open: boolean) => void;
    currentUsers: dashboardUserSelectReturn;
    setCurrentUsers: (users: dashboardUserSelectReturn) => void;
    dashboardId: string;
    ownerId: string;
}) {
    const [role, setRole] = useState<"viewer" | "editor" | "admin">("viewer");
    const [state, formAction, pending] = useActionState(addUser, {
        messages: { userId: "" },
        errors: { userId: [] },
        profile: undefined,
    });

    const t = useTranslations("editDashboard.addUserDialog");

    function handleSubmit() {
        if (!state.profile) {
            return;
        }

        const user: dashboardUserSelectReturn[0] = {
            profile: {
                profileId: state.profile.profileId,
                username: state.profile.username,
                icon: state.profile.icon,
                publicEmail: state.profile.publicEmail,
                userId: state.profile.userId,
                preferences: null,
            },
            role: role,
            dashboardId: dashboardId,
        };

        console.log("Added: ", user.profile?.profileId);
        console.log("Owner: ", ownerId);
        console.log("Users: ", currentUsers);

        if (currentUsers.find((existing) => existing.profile?.profileId === user.profile?.profileId)) {
            toast.error(t("userAlreadyExists"));
            return;
        }

        if (ownerId === user.profile?.profileId) {
            toast.error(t("userAlreadyExists"));
            return;
        }

        setCurrentUsers([...currentUsers, user]);
        onOpenChange(false);
    }

    return (
        <Dialog open={opened} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                </DialogHeader>
                <div className="flex w-full flex-col items-center justify-start space-y-4 px-4">
                    <form className="flex w-full flex-row items-center justify-between" action={formAction}>
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="userId" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("userId")}
                            </label>
                            <div className="flex w-full flex-row items-center justify-between space-x-2">
                                <label
                                    className="flex w-10/12 flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                    htmlFor="userid"
                                >
                                    <div className="flex w-[10%] text-neutral-400">
                                        <LuHash role="presentation" />
                                        <span className="sr-only">{t("userId")}</span>
                                    </div>
                                    <input
                                        type="text"
                                        id="useid"
                                        name="userid"
                                        className="flex w-[90%] py-1 text-sm focus:outline-0 md:text-base"
                                        placeholder="abcdefghijklmnopqrstuv"
                                        defaultValue={state.messages.userId}
                                        data-error={state.errors?.userId ? true : false}
                                        autoComplete="off"
                                        required
                                    />
                                </label>
                                <button
                                    className="flex w-2/12 cursor-pointer flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs shadow hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white md:text-sm"
                                    type="submit"
                                    title={t("add")}
                                    disabled={pending}
                                >
                                    {pending ? (
                                        <LuLoaderCircle className="size-5 animate-spin" />
                                    ) : (
                                        <LuPlus className="size-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex min-h-6 w-full flex-col items-start justify-start space-y-1 pt-1">
                                {state.errors?.userId && (
                                    <span className="text-xs text-red-500/50 md:text-sm">
                                        {state.errors.userId.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </form>
                    <div className="flex min-h-16 w-full flex-row items-center justify-between space-x-1">
                        {state.profile && (
                            <div className="flex w-full flex-row items-center justify-between rounded-md border border-neutral-200 px-3 py-2 shadow">
                                <div className="flex flex-row items-center justify-start space-x-2">
                                    <div className={`${notoColorEmoji.className} text-xl`}>{state.profile.icon}</div>
                                    <span className="text-lg font-semibold">{state.profile.username}</span>
                                </div>
                                <Select
                                    value={role}
                                    onValueChange={(value) => setRole(value as "viewer" | "editor" | "admin")}
                                >
                                    <SelectTrigger className="w-1/3">
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
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <button
                        className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-default disabled:bg-blue-300 md:text-sm"
                        type="button"
                        disabled={state.profile === undefined}
                        onClick={handleSubmit}
                    >
                        <span>{t("confirm")}</span>
                        <LuCheck className="size-3" />
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
