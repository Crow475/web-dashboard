"use client";

import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import DeleteDialog from "@/components/custom/deleteDialog";

import { LuTrash2 } from "react-icons/lu";

export default function DeleteDashboardButton({
    label,
    buttonText,
    description,
    dashboardId,
    dashboardTitle,
    dashboardIcon,
}: {
    label: string;
    buttonText: string;
    description: string;
    dashboardId: string;
    dashboardTitle: string;
    dashboardIcon: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col items-start justify-start space-y-2 py-2">
                <div className="flex w-full flex-row items-center justify-between px-2 md:px-6">
                    <label htmlFor="delteDashboardButton" className="w-2/3 text-red-500">
                        {label}
                    </label>
                    <button
                        className="flex cursor-pointer flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-3 py-1.5 text-xs text-neutral-500 shadow hover:border-red-300 hover:bg-red-200 hover:text-red-500 hover:shadow-red-200 md:px-2 md:py-1 md:text-sm"
                        type="button"
                        onClick={() => setOpen(true)}
                    >
                        <span>{buttonText}</span>
                        <LuTrash2 className="size-3 md:size-4" />
                    </button>
                </div>
                <p className="px-6 text-xs text-neutral-500">{description}</p>
            </div>
            <Separator className="w-full" />
            <DeleteDialog
                open={open}
                onOpenChange={(open) => setOpen(open)}
                id={dashboardId}
                title={dashboardTitle}
                icon={dashboardIcon}
            />
        </>
    );
}
