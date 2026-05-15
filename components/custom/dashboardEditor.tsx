"use client";

import { useState } from "react";

import Link from "next/link";

import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";

import { useTranslations } from "next-intl";

import type { dashboardSelectReturn, dashboardProps } from "@/lib/types";
import { notoColorEmoji } from "@/lib/fonts";
import uuidToShort from "@/lib/uuidToShort";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

import {
    LuCheck,
    LuMoveLeft,
    LuPencil,
    LuScan,
    LuCirclePlus,
    LuPanelRightOpen,
    LuPanelRightClose,
    LuAppWindow,
    LuSlidersHorizontal,
    LuUsers,
    LuListX,
    LuChevronUp,
    LuChevronDown,
} from "react-icons/lu";

export default function DashboardEditor({ dashboard }: { dashboard: dashboardSelectReturn }) {
    const properties = dashboard.properties as dashboardProps;
    const defaultPrivate: boolean = dashboard.isPrivate ? true : false;

    const [title, setTitle] = useState(dashboard.title);
    const [icon, setIcon] = useState(dashboard.icon);
    const [privateDashboard, setPrivateDashboard] = useState(defaultPrivate);
    const [rowCount, setRowCount] = useState(properties.rows);

    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [lastOpenTab, setLastOpenTab] = useState("widgets");

    const t = useTranslations("editDashboard");

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
                            <PopoverContent className="w-auto p-0">
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
                    <button className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm">
                        <span className="text-xs md:text-sm">{t("submit")}</span>
                        <LuCheck className="size-3" />
                    </button>
                </div>
            </header>
            <div className="flex w-full flex-row items-center justify-center pr-4">
                <ScrollArea
                    className={`flex h-[88vh] ${sidePanelOpen ? "w-[78%]" : "w-full"} flex-col items-center justify-start px-4 py-5`}
                >
                    <div className="h-2 w-full" role="presentation"></div>
                    <div className="absolute bottom-0 left-0 z-10 h-8 w-full bg-linear-to-t from-white to-transparent"></div>
                    <div className="grid grid-cols-2 gap-2">
                        {mockRows.map((row) => (
                            <>
                                <HoverCard key={`${row}-1`}>
                                    <HoverCardTrigger asChild>
                                        <div className="relative flex h-[40vh] w-full rounded-xl border border-neutral-100 bg-white shadow-inner">
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
                                            className="flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1 py-1 text-neutral-800 shadow hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400 md:text-sm"
                                            type="button"
                                            title={t("moveRowUp")}
                                        >
                                            <LuChevronUp className="size-4" />
                                        </button>
                                        <button
                                            className="flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1 py-1 text-red-500 shadow hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400 md:text-sm"
                                            type="button"
                                            onClick={() => setRowCount(rowCount - 1)}
                                            title={t("deleteRow")}
                                        >
                                            <LuListX className="size-4" />
                                        </button>
                                        <button
                                            className="flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1 py-1 text-neutral-800 shadow hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400 md:text-sm"
                                            type="button"
                                            title={t("moveRowDown")}
                                        >
                                            <LuChevronDown className="size-4" />
                                        </button>
                                    </HoverCardContent>
                                </HoverCard>
                                <HoverCard key={`${row}-2`}>
                                    <HoverCardTrigger asChild>
                                        <div className="relative flex h-[40vh] w-full rounded-xl border border-neutral-100 bg-white shadow-inner">
                                            <div className="hidden w-full flex-col items-center justify-center only:flex">
                                                <LuScan className="size-20 text-neutral-100" />
                                            </div>
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent
                                        side="left"
                                        align="center"
                                        className={`hidden w-10 flex-col items-center justify-center`}
                                    ></HoverCardContent>
                                </HoverCard>
                            </>
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
                            <TabsContent value="widgets">1</TabsContent>
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
            </div>
        </div>
    );
}
