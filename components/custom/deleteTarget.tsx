"use client";

import { useTranslations } from "next-intl";

import { useDroppable } from "@dnd-kit/react";

import { LuTrash2 } from "react-icons/lu";

export default function DeleteTarget({ show }: { show: boolean }) {
    const t = useTranslations("editDashboard");
    const { ref } = useDroppable({
        id: "delete",
    });

    if (!show) return null;

    return (
        <div
            className="absolute top-0 z-10 flex h-[99%] w-[90%] flex-col items-center justify-center rounded-lg bg-linear-to-t from-red-100/50 to-neutral-100/50 to-40% outline-4 outline-neutral-300 backdrop-blur-xs"
            ref={ref}
        >
            <LuTrash2 className="size-10 text-neutral-300" />
            <span className="text-lg font-semibold text-neutral-300">{t("delteTarget")}</span>
        </div>
    );
}
