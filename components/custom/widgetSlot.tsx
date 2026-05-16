"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import type { dashboardElement } from "@/lib/types";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { LuChevronUp, LuChevronDown, LuListX, LuScan, LuCircleAlert } from "react-icons/lu";

import { useDroppable } from "@dnd-kit/react";

export default function WidgetSlot({
    id,
    children,
    odd,
    elements,
    setElements,
    rowCount,
    setRowCount,
}: Readonly<{
    id: string;
    children: React.ReactNode;
    odd: boolean;
    elements: dashboardElement[];
    setElements: React.Dispatch<React.SetStateAction<dashboardElement[]>>;
    rowCount: number;
    setRowCount: React.Dispatch<React.SetStateAction<number>>;
}>) {
    const [showDelteDialog, setShowDelteDialog] = useState(false);
    const t = useTranslations("editDashboard");
    const { ref } = useDroppable({
        id: id,
    });

    const rowNumber = parseInt(id.split("-")[0]);

    function handleDelete() {
        const elementsInRow = elements.filter((element) => element.position.row === rowNumber);

        if (elementsInRow.length === 0) {
            handleRowDelete();
        } else {
            setShowDelteDialog(true);
        }
    }

    function handleRowDelete() {
        const oldElements = [...elements];

        const noDeletedRow = oldElements.filter((element) => element.position.row !== rowNumber);

        const movedElements = noDeletedRow.map((element) => {
            if (element.position.row > rowNumber) {
                return {
                    ...element,
                    position: {
                        ...element.position,
                        row: element.position.row - 1,
                    },
                };
            }
            return element;
        });

        setElements(movedElements);
        setRowCount(rowCount - 1);
    }

    function handleRowUp() {
        if (rowNumber === 1) return;

        const oldElements = [...elements];

        const prevRowElements = oldElements.filter((element) => element.position.row === rowNumber - 1);
        const currentRowElements = oldElements.filter((element) => element.position.row === rowNumber);

        const movedPrevRowElements = prevRowElements.map((element) => {
            return {
                ...element,
                position: {
                    ...element.position,
                    row: element.position.row + 1,
                },
            };
        });

        const movedCurrentRowElements = currentRowElements.map((element) => {
            return {
                ...element,
                position: {
                    ...element.position,
                    row: element.position.row - 1,
                },
            };
        });

        const deletedBothRows = oldElements.filter(
            (element) => element.position.row !== rowNumber && element.position.row !== rowNumber - 1,
        );

        setElements([...movedPrevRowElements, ...movedCurrentRowElements, ...deletedBothRows]);
    }

    function handleRowDown() {
        const oldElements = [...elements];

        const nextRowElements = oldElements.filter((element) => element.position.row === rowNumber + 1);
        const currentRowElements = oldElements.filter((element) => element.position.row === rowNumber);

        const movedNextRowElements = nextRowElements.map((element) => {
            return {
                ...element,
                position: {
                    ...element.position,
                    row: element.position.row - 1,
                },
            };
        });

        const movedCurrentRowElements = currentRowElements.map((element) => {
            return {
                ...element,
                position: {
                    ...element.position,
                    row: element.position.row + 1,
                },
            };
        });

        const deletedBothRows = oldElements.filter(
            (element) => element.position.row !== rowNumber && element.position.row !== rowNumber + 1,
        );

        setElements([...movedNextRowElements, ...movedCurrentRowElements, ...deletedBothRows]);
    }

    if (odd) {
        return (
            <div
                className="relative flex h-[40vh] w-full rounded-xl border border-neutral-100 bg-white shadow-inner"
                ref={ref}
            >
                {children}
                <div className="hidden w-full flex-col items-center justify-center only:flex">
                    <LuScan className="size-20 text-neutral-100" />
                </div>
            </div>
        );
    }

    return (
        <>
            <AlertDialog open={showDelteDialog} onOpenChange={() => setShowDelteDialog(!showDelteDialog)}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia>
                            <LuCircleAlert className="size-10 text-red-400" />
                        </AlertDialogMedia>
                    </AlertDialogHeader>
                    <AlertDialogTitle className="text-center">{t("deleteDialog.title")}</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {t("deleteDialog.paragraph")}
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleRowDelete()}>
                            {t("deleteDialog.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div
                        className="relative flex h-[40vh] w-full rounded-xl border border-neutral-100 bg-white shadow-inner"
                        ref={ref}
                    >
                        {children}
                        <div className="hidden w-full flex-col items-center justify-center only:flex">
                            <LuScan className="size-20 text-neutral-100" />
                        </div>
                    </div>
                </HoverCardTrigger>
                <HoverCardContent
                    side="left"
                    align="center"
                    className={`flex w-10 flex-col items-center justify-center space-y-1`}
                >
                    <button
                        className="flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1 py-1 text-neutral-800 shadow hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white md:text-sm"
                        type="button"
                        title={t("moveRowUp")}
                        onClick={handleRowUp}
                        disabled={rowNumber === 1}
                    >
                        <LuChevronUp className="size-4" />
                    </button>
                    <button
                        className="flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1 py-1 text-red-500 shadow hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white md:text-sm"
                        type="button"
                        onClick={handleDelete}
                        disabled={rowCount === 1}
                        title={t("deleteRow")}
                    >
                        <LuListX className="size-4" />
                    </button>
                    <button
                        className="flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1 py-1 text-neutral-800 shadow hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white md:text-sm"
                        type="button"
                        onClick={handleRowDown}
                        disabled={rowNumber === rowCount}
                        title={t("moveRowDown")}
                    >
                        <LuChevronDown className="size-4" />
                    </button>
                </HoverCardContent>
            </HoverCard>
        </>
    );
}
