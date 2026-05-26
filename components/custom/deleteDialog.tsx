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
import { useTranslations } from "next-intl";

import { notoColorEmoji } from "@/lib/fonts";

import uuidToShort from "@/lib/uuidToShort";
import { deleteDashboard } from "@/actions/deleteDashboard";

export default function DeleteDialog({
    open,
    onOpenChange,
    id,
    title,
    icon,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: string;
    title: string;
    icon: string;
}) {
    const t = useTranslations("component.deleteDialog");

    async function handleDelete() {
        const result = await deleteDashboard(uuidToShort(id));

        if (result) {
            window.location.href = "/app";
            toast.success(t("success") + '"' + result.deletedTitle + '"');
        } else {
            toast.error(t("failure"));
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={() => onOpenChange(!open)}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <span
                            className={`${notoColorEmoji.className} text-2xl select-none md:text-4xl`}
                            role="img"
                            aria-label={t("icon")}
                        >
                            {icon}
                        </span>
                    </AlertDialogMedia>
                </AlertDialogHeader>
                <AlertDialogTitle className="text-center">{t("title")}</AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                    {t("paragraph")} &quot;<strong>{title}</strong>&quot;?
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => handleDelete()}>
                        {t("delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
