"use client";
import { useState, useEffect } from "react";

import type { dashboardFullSelectReturn } from "@/lib/types";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { toast } from "sonner";

import { LuUserPlus, LuCheck } from "react-icons/lu";

import DashboardInviteListItem from "@/components/custom/dashboardInviteListItem";

import getInvitableDashboards from "@/actions/getInvitableDashboards";
import addUserToDashboard from "@/actions/addUserToDashboard";

import { useTranslations } from "next-intl";

export default function InviteToButton({ profileId }: { profileId: string }) {
    const [open, setOpen] = useState(false);
    const [dashboards, setDashboards] = useState<dashboardFullSelectReturn>([]);
    const [role, setRole] = useState<"viewer" | "editor" | "admin">("viewer");
    const [selectedDashboard, setSelectedDashboard] = useState<dashboardFullSelectReturn[0] | null>(null);

    const t = useTranslations("inviteTo");

    useEffect(() => {
        const getDashboards = async () => {
            const result = await getInvitableDashboards();
            if (result) {
                setDashboards(result);
            }
        };

        getDashboards();
    }, []);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <button className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-sm text-white shadow hover:bg-blue-600 md:text-base">
                    <LuUserPlus />
                    <span>{t("button")}</span>
                </button>
            </DialogTrigger>
            <DialogContent className="min-w-48">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <span>{t("paragraph")}</span>
                    <div className="flex flex-row items-center justify-start space-x-2">
                        <span className="text-sm text-neutral-500">{t("roleLabel")}</span>
                        <Select value={role} onValueChange={(value) => setRole(value as "viewer" | "editor" | "admin")}>
                            <SelectTrigger className="w-1/2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="viewer">{t("roleViewer")}</SelectItem>
                                    <SelectItem value="editor">{t("roleEditor")}</SelectItem>
                                    <SelectItem value="admin">{t("roleAdmin")}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </DialogHeader>
                <div className="flex max-h-[50vh] flex-col items-center justify-start space-y-2 overflow-y-auto px-4 py-2">
                    {dashboards.map((dashboard) => (
                        <DashboardInviteListItem
                            key={dashboard.dashboardId}
                            dashboard={dashboard}
                            selectedDashboard={selectedDashboard}
                            setSelectedDashboard={setSelectedDashboard}
                        />
                    ))}
                </div>
                <DialogFooter>
                    <button
                        className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm"
                        disabled={!selectedDashboard}
                        onClick={async () => {
                            const result = await addUserToDashboard(
                                selectedDashboard?.dashboardId ?? "",
                                profileId,
                                role,
                            );
                            if (!result) {
                                toast.error(t("failed"));
                            }
                            if (result?.success) {
                                setSelectedDashboard(null);
                                setOpen(false);
                                toast.success(t("success"));
                            } else {
                                toast.error(t("failed"));
                            }
                        }}
                    >
                        <span>{t("invite")}</span>
                        <LuCheck />
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
