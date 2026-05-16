"use client";

import React, { useState } from "react";

import Link from "next/link";

import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";

import { DragDropProvider } from "@dnd-kit/react";

import { useTranslations } from "next-intl";

import { createTranslator } from "short-uuid";

import type { dashboardSelectReturn, dashboardProps, dashboardElement } from "@/lib/types";
import { notoColorEmoji } from "@/lib/fonts";
import uuidToShort from "@/lib/uuidToShort";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import WidgetSlot from "@/components/custom/widgetSlot";
import DeleteTarget from "@/components/custom/deleteTarget";

import DragElement from "../dragElement";

import {
    LuCheck,
    LuMoveLeft,
    LuPencil,
    LuCirclePlus,
    LuPanelRightOpen,
    LuPanelRightClose,
    LuAppWindow,
    LuSlidersHorizontal,
    LuUsers,
} from "react-icons/lu";

export default function DashboardEditor({ dashboard }: { dashboard: dashboardSelectReturn }) {
    const properties = dashboard.properties as dashboardProps;
    const defaultPrivate: boolean = dashboard.isPrivate ? true : false;

    const [title, setTitle] = useState(dashboard.title);
    const [icon, setIcon] = useState(dashboard.icon);
    const [privateDashboard, setPrivateDashboard] = useState(defaultPrivate);
    const [rowCount, setRowCount] = useState(properties.rows);
    const [elements, setElements] = useState<dashboardElement[]>([]);

    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [lastOpenTab, setLastOpenTab] = useState("widgets");
    const [isDragging, setIsDragging] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const t = useTranslations("editDashboard");
    const decimalTranslator = createTranslator("0123456789");

    const mockRows = Array.from({ length: rowCount }, (_, i) => i + 1);

    return (
        <div className="flex w-full flex-col items-center justify-start">
            <header className="flex w-[98%] flex-row items-center justify-between border-b border-neutral-300 px-4 py-4">
                <div className="flex w-full flex-row items-center justify-start space-x-3">
                    <label>
                        <span className="sr-only">{t("icon")}</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className={`${notoColorEmoji.className} group relative flex flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1.5 py-1.5 text-3xl shadow`}
                                    type="button"
                                >
                                    {icon}
                                    <div className="pointer-events-none absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-full bg-blue-300/20 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
                                        <LuPencil className="size-8 text-white" />
                                    </div>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="mx-2 w-auto p-0">
                                <EmojiPicker
                                    emojiStyle={EmojiStyle.GOOGLE}
                                    onEmojiClick={(emojiObject) => setIcon(emojiObject.emoji)}
                                    previewConfig={{ showPreview: false }}
                                    height={350}
                                />
                            </PopoverContent>
                        </Popover>
                    </label>
                    <label htmlFor="title" className="w-2/3">
                        <span className="sr-only">{t("title")}</span>
                        <input
                            className="w-full rounded-md border border-neutral-200 px-2 py-1 text-3xl font-bold shadow outline-0 focus-within:border-blue-500"
                            type="text"
                            autoComplete="off"
                            name="title"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex flex-row items-center justify-end space-x-2">
                    <button
                        className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs text-neutral-500 shadow hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400 md:text-sm"
                        type="button"
                        onClick={() => setSidePanelOpen(!sidePanelOpen)}
                        title={t("sidePanel")}
                    >
                        {sidePanelOpen ? (
                            <LuPanelRightClose className="size-5" />
                        ) : (
                            <LuPanelRightOpen className="size-5" />
                        )}
                    </button>
                    <Link
                        className="hover:test-bg-neutral-800 flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs text-neutral-500 shadow hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400 md:text-sm"
                        href={`/app/dashboard/${uuidToShort(dashboard.dashboardId)}`}
                    >
                        <LuMoveLeft className="size-3" />
                        <span>{t("cancel")}</span>
                    </Link>
                    <button
                        className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm"
                        onClick={() => console.log(elements)}
                    >
                        <span className="text-xs md:text-sm">{t("submit")}</span>
                        <LuCheck className="size-3" />
                    </button>
                </div>
            </header>
            <div className="flex w-full flex-row items-center justify-center pr-4">
                <DragDropProvider
                    onDragEnd={(event) => {
                        if (event.canceled) {
                            // console.log("case - canceled");

                            setShowDelete(false);
                            setIsDragging(false);
                            return;
                        }
                        if (!event.operation.target) {
                            // console.log("case - no target");

                            setShowDelete(false);
                            setIsDragging(false);
                            return;
                        }

                        console.log(event);

                        console.log("Source: ", event.operation.source?.id);
                        console.log("Source data: ", event.operation.source?.data);
                        console.log("Target: ", event.operation.target?.id);

                        if (event.operation.target?.id === "delete") {
                            if (
                                event.operation.source?.id.toString().split("-")[0] !== "0" &&
                                event.operation.source?.id.toString().split("-")[1] !== "0"
                            ) {
                                setElements([
                                    ...elements.filter(
                                        (element) => element.id !== event.operation.source?.id.toString().split("-")[2],
                                    ),
                                ]);

                                // console.log("case - delete");

                                setShowDelete(false);
                                setIsDragging(false);
                                return;
                            }
                        }

                        const posRow = parseInt(event.operation.target?.id.toString().split("-")[0] ?? "");
                        const posCol = parseInt(event.operation.target?.id.toString().split("-")[1] ?? "");

                        console.log("Target: ", posRow, posCol);

                        if (
                            event.operation.source?.id.toString().split("-")[0] !== "0" &&
                            event.operation.source?.id.toString().split("-")[1] !== "0"
                        ) {
                            const sourceRow = parseInt(event.operation.source?.id.toString().split("-")[0] ?? "");
                            const sourceCol = parseInt(event.operation.source?.id.toString().split("-")[1] ?? "");
                            const sourceUnique = event.operation.source?.id.toString().split("-")[2] ?? "";

                            if (
                                elements.find(
                                    (element) => element.position.row === posRow && element.position.col === posCol,
                                )
                            ) {
                                // console.log("case - move occupied");

                                setIsDragging(false);
                                setShowDelete(false);
                                return;
                            }

                            console.log("Source: ", sourceRow, sourceCol);
                            console.log("Source type: ", event.operation.source?.data.type);

                            const newElements = [
                                ...elements.filter((element) => element.id !== sourceUnique),
                                {
                                    id: sourceUnique,
                                    position: {
                                        row: posRow,
                                        col: posCol,
                                    },
                                    type: event.operation.source?.data.type,
                                    content: "test",
                                    component: (
                                        <DragElement
                                            isDropped
                                            isDragging={isDragging}
                                            id={posRow + "-" + posCol + "-" + sourceUnique}
                                        />
                                    ),
                                },
                            ];

                            console.log(newElements);
                            // console.log("case - move");

                            setElements(newElements);
                        } else {
                            const newUnique = decimalTranslator.generate();

                            if (
                                elements.find(
                                    (element) => element.position.row === posRow && element.position.col === posCol,
                                )
                            ) {
                                // console.log("case - new occupied");

                                setShowDelete(false);
                                setIsDragging(false);
                                return;
                            }

                            const newElements = [
                                ...elements,
                                {
                                    id: newUnique,
                                    position: {
                                        row: posRow,
                                        col: posCol,
                                    },
                                    type: event.operation.source?.data.type,
                                    content: "test",
                                    component: (
                                        <DragElement
                                            isDropped
                                            isDragging={isDragging}
                                            id={posRow + "-" + posCol + "-" + newUnique}
                                        />
                                    ),
                                },
                            ];

                            // console.log("case - new");

                            console.log(newElements);

                            setElements(newElements);
                        }

                        setShowDelete(false);
                        setIsDragging(false);
                    }}
                    onDragStart={(event) => {
                        if (
                            event.operation.source?.id.toString().split("-")[0] !== "0" &&
                            event.operation.source?.id.toString().split("-")[1] !== "0"
                        ) {
                            setShowDelete(true);
                        } else {
                            setShowDelete(false);
                        }

                        setIsDragging(true);
                    }}
                >
                    <ScrollArea
                        className={`flex h-[88vh] ${sidePanelOpen ? "w-[78%]" : "w-full"} flex-col items-center justify-start px-4`}
                    >
                        <div className="h-5 w-full" role="presentation"></div>
                        <div className="absolute bottom-0 left-0 z-10 h-3 w-[99%] bg-linear-to-t from-white to-transparent"></div>
                        <div className="grid grid-cols-2 gap-2">
                            {mockRows.map((row) => (
                                <React.Fragment key={row}>
                                    <WidgetSlot
                                        id={`${row}-1`}
                                        odd={false}
                                        elements={elements}
                                        setElements={setElements}
                                        rowCount={rowCount}
                                        setRowCount={setRowCount}
                                    >
                                        {
                                            elements.find(
                                                (element) => element.position.row === row && element.position.col === 1,
                                            )?.component
                                        }
                                    </WidgetSlot>
                                    <WidgetSlot
                                        key={`${row}-2`}
                                        id={`${row}-2`}
                                        odd
                                        elements={elements}
                                        setElements={setElements}
                                        rowCount={rowCount}
                                        setRowCount={setRowCount}
                                    >
                                        {
                                            elements.find(
                                                (element) => element.position.row === row && element.position.col === 2,
                                            )?.component
                                        }
                                    </WidgetSlot>
                                </React.Fragment>
                            ))}
                            <button
                                className="border-neutral col-span-2 flex w-full cursor-pointer flex-row items-center justify-center space-x-3 rounded-xl border py-4 text-neutral-600 shadow hover:bg-neutral-100"
                                type="button"
                                onClick={() => setRowCount(rowCount + 1)}
                            >
                                <LuCirclePlus className="size-6" />
                                <span className="text-lg font-semibold">{t("addRow")}</span>
                            </button>
                        </div>
                        <div className="h-10 w-full" role="presentation"></div>
                    </ScrollArea>
                    {sidePanelOpen && (
                        <div className="flex h-full w-[22%] border-l border-neutral-300 bg-white">
                            <Tabs
                                className="w-full"
                                defaultValue={lastOpenTab}
                                onValueChange={(value) => setLastOpenTab(value)}
                            >
                                <div className="flex w-full flex-row items-center justify-center py-3">
                                    <TabsList>
                                        <TabsTrigger value="widgets">
                                            <LuAppWindow />
                                            {t("widgets")}
                                        </TabsTrigger>
                                        <TabsTrigger value="settings">
                                            <LuSlidersHorizontal />
                                            {t("settings")}
                                        </TabsTrigger>
                                        <TabsTrigger value="users">
                                            <LuUsers />
                                            {t("users")}
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="widgets">
                                    <div className="relative flex h-full w-full flex-col items-start justify-start space-y-2 px-4">
                                        <DeleteTarget show={showDelete && isDragging} />
                                        <DragElement id={`0-0-${decimalTranslator.generate()}`} />
                                        <DragElement id={`0-0-${decimalTranslator.generate()}`} />
                                    </div>
                                </TabsContent>
                                <TabsContent value="settings">
                                    <div className="flex w-full flex-col items-center justify-start pr-2 pl-4">
                                        <div className="flex flex-col items-start justify-start space-y-1 py-2">
                                            <div className="flex w-full flex-row items-center justify-around">
                                                <label htmlFor="privateCheckbox" className="w-2/3">
                                                    {t("private")}
                                                </label>
                                                <input
                                                    type="checkbox"
                                                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm shadow outline-0 focus-within:border-blue-500"
                                                    id="privateCheckbox"
                                                    name="privateCheckbox"
                                                    checked={privateDashboard}
                                                    onChange={(e) => setPrivateDashboard(e.target.checked)}
                                                />
                                            </div>
                                            <p className="px-6 text-xs text-neutral-500">{t("privateDescription")}</p>
                                        </div>
                                        <Separator className="w-full" />
                                    </div>
                                </TabsContent>
                                <TabsContent value="users">3</TabsContent>
                            </Tabs>
                        </div>
                    )}
                </DragDropProvider>
            </div>
        </div>
    );
}
