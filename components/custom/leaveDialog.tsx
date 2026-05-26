"use client";

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
import { toast } from "sonner";

import { LuCircleAlert } from "react-icons/lu";

import { useTranslations } from "next-intl";

import leaveDashboard from "@/actions/leaveDashboard";

export default function LeaveDialog({
    open,
    onOpenChange,
    id,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: string;
}) {
    const t = useTranslations("component.leaveDashboardDialog");

    async function handleLeaveDashboard() {
        onOpenChange(false);
        const result = await leaveDashboard(id);

        if (result) {
            window.location.href = "/app";
        } else {
            toast.error(t("error"));
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={() => onOpenChange(!open)}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <LuCircleAlert className="text-red-500" />
                    </AlertDialogMedia>
                </AlertDialogHeader>
                <AlertDialogTitle className="text-center">{t("title")}</AlertDialogTitle>
                <AlertDialogDescription className="text-center">{t("paragraph")}</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => handleLeaveDashboard()}>
                        {t("leave")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
