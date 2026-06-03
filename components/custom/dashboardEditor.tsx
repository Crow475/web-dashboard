"use client";

import React, { useState, useRef, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";

import { DragDropProvider } from "@dnd-kit/react";

import { useTranslations } from "next-intl";

import { createTranslator } from "short-uuid";

import type { dashboardSelectReturn, dashboardUserSelectReturn, dashboardProps, dashboardElement } from "@/lib/types";
import { WidgetType } from "@/lib/widgetRegistry";
import { notoColorEmoji } from "@/lib/fonts";
import uuidToShort from "@/lib/uuidToShort";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import WidgetSlot from "@/components/custom/widgetSlot";
import DeleteTarget from "@/components/custom/deleteTarget";
import AddUserDialog from "@/components/custom/addUserDialog";
import UserCard from "@/components/custom/userCard";
import OwnerCard from "@/components/custom/ownerCard";
import PrivateCheckbox from "@/components/custom/privateCheckbox";

import Widget from "@/components/custom/widget";

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
    LuUserPlus,
    LuCircleOff,
    LuLoaderCircle,
    LuCaseSensitive,
} from "react-icons/lu";

import { updateDashboard, dashboardData } from "@/actions/updateDashboard";
import updateDashboardUsers from "@/actions/updateDashboardUsers";

import { themeRegistry, themeTypes } from "@/lib/themeRegistry";

export default function DashboardEditor({
    dashboard,
    users,
    role,
    profileId,
}: {
    dashboard: dashboardSelectReturn;
    users: dashboardUserSelectReturn;
    role: "admin" | "editor" | "viewer" | "owner";
    profileId: string;
}) {
    const router = useRouter();
    const properties = dashboard.properties as dashboardProps;
    const preferences = properties.preferences;
    const defaultPrivate: boolean = dashboard.isPrivate ? true : false;

    console.log(role);

    const defaultElements: dashboardElement[] = properties.elements.map((element) => {
        return {
            id: element.id,
            position: element.position,
            type: element.type,
            content: element.content,
        };
    });

    const [title, setTitle] = useState(dashboard.title);
    const [icon, setIcon] = useState(dashboard.icon?.trim());
    const [privateDashboard, setPrivateDashboard] = useState(defaultPrivate);
    const [rowCount, setRowCount] = useState(properties.rows);
    const [elements, setElements] = useState<dashboardElement[]>(defaultElements);
    const [currentUsers, setCurrentUsers] = useState(users);
    const [usersChanged, setUsersChanged] = useState(false);
    const [theme, setTheme] = useState(preferences.theme ?? "none");

    const elementsRef = useRef(elements);

    useEffect(() => {
        elementsRef.current = elements;
    }, [elements]);

    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [lastOpenTab, setLastOpenTab] = useState("widgets");
    const [isDragging, setIsDragging] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const t = useTranslations("editDashboard");
    const decimalTranslator = createTranslator("0123456789");

    const mockRows = Array.from({ length: rowCount }, (_, i) => i + 1);

    function handlePropsChange(elementId: string, newProps: { [key: string]: string }) {
        const elementRow = parseInt(elementId.split("-")[0]);
        const elementCol = parseInt(elementId.split("-")[1]);
        const elementUnique = elementId.split("-")[2];

        const currentElements = elementsRef.current;

        const elementToUpdate = currentElements.find((element) => element.id === elementUnique);

        if (!elementToUpdate) {
            return;
        }

        const updated = {
            ...elementToUpdate,
            content: newProps,
            position: { row: elementRow, col: elementCol },
        };

        setElements([...currentElements.filter((el) => el.id !== elementUnique), updated]);
    }

    async function handleSubmit() {
        const data: dashboardData = {
            title: title,
            icon: icon ?? "",
            private: privateDashboard,
            props: {
                rows: rowCount,
                elements: elements,
                preferences: {
                    theme: theme,
                },
            },
        };

        console.log(data);
        console.log(currentUsers);

        setSubmitted(true);

        const result = await updateDashboard(dashboard.dashboardId, data);

        if (!result.success) {
            if (result.errors) {
                if (result.errors.auth) {
                    toast.error(t("errors.auth") + " " + t(`errors.${result.errors.auth[0]}`));
                    return;
                }
                if (result.errors.db) {
                    toast.error(t(`errors.${result.errors.db[0]}`));
                    return;
                }
                if (result.errors.title) {
                    toast.error(t(`errors.${result.errors.title[0]}`));
                    return;
                }
                if (result.errors.icon) {
                    toast.error(t(`errors.${result.errors.icon[0]}`));
                    return;
                }
                if (result.errors.private) {
                    toast.error(t(`errors.${result.errors.private[0]}`));
                    return;
                }
            }

            return;
        }

        if (usersChanged) {
            const resultUsers = await updateDashboardUsers(dashboard.dashboardId, currentUsers);

            if (!resultUsers.success) {
                if (resultUsers.errors) {
                    if (resultUsers.errors.auth) {
                        toast.error(t(`errors.${resultUsers.errors.auth[0]}`));
                        return;
                    }
                    if (resultUsers.errors.db) {
                        toast.error(t(`errors.${resultUsers.errors.db[0]}`));
                        return;
                    }
                }

                return;
            }

            toast.success("Updated users");
        }

        router.push(`/app/dashboard/${uuidToShort(dashboard.dashboardId)}`);
        toast.success(t("success") + ' "' + data.title + '"');
    }

    return (
        <>
            <div className="hidden w-full flex-col items-center justify-start md:flex">
                <header className="flex w-[98%] flex-row items-center justify-between border-b border-neutral-300 px-4 py-4">
                    <div className="flex w-full flex-row items-center justify-start space-x-3">
                        <label>
                            <span className="sr-only">{t("icon")}</span>
                            <Popover>
                                <PopoverTrigger asChild disabled={!["admin", "owner"].includes(role)}>
                                    <button
                                        className={`${notoColorEmoji.className} group relative flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1.5 py-1.5 text-3xl shadow disabled:cursor-default disabled:bg-neutral-50`}
                                        type="button"
                                    >
                                        {icon}
                                        <div className="pointer-events-none absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-full bg-blue-300/20 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 group-disabled:hidden">
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
                                className="w-full rounded-md border border-neutral-200 px-2 py-1 text-3xl font-bold shadow outline-0 focus-within:border-blue-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                                type="text"
                                autoComplete="off"
                                name="title"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={!["admin", "owner"].includes(role)}
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
                            className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs text-neutral-500 shadow hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400 md:text-sm"
                            href={`/app/dashboard/${uuidToShort(dashboard.dashboardId)}`}
                        >
                            <LuMoveLeft className="size-3" />
                            <span>{t("cancel")}</span>
                        </Link>
                        <button
                            className="group flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm"
                            onClick={() => handleSubmit()}
                            disabled={submitted}
                        >
                            <span className="text-xs md:text-sm">{t("submit")}</span>
                            <LuCheck className="block size-3 group-disabled:hidden" />
                            <LuLoaderCircle className="hidden size-3 animate-spin group-disabled:block" />
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
                                            (element) =>
                                                element.id !== event.operation.source?.id.toString().split("-")[2],
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
                                        content: event.operation.source?.data.props,
                                        component: (
                                            <Widget
                                                isDropped
                                                id={posRow + "-" + posCol + "-" + sourceUnique}
                                                type={event.operation.source?.data.type as WidgetType}
                                                defaultProps={event.operation.source?.data.props}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`${posRow}-${posCol}-${sourceUnique}`, newProps)
                                                }
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
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

                                const newId = posRow + "-" + posCol + "-" + newUnique;

                                const newElements = [
                                    ...elements,
                                    {
                                        id: newUnique,
                                        position: {
                                            row: posRow,
                                            col: posCol,
                                        },
                                        type: event.operation.source?.data.type,
                                        content: event.operation.source?.data.props,
                                        component: (
                                            <Widget
                                                isDropped
                                                id={newId}
                                                type={event.operation.source?.data.type as WidgetType}
                                                defaultProps={event.operation.source?.data.props}
                                                onPropsChange={(newProps) => handlePropsChange(newId, newProps)}
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
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
                            className={`flex h-[88vh] bg-fixed ${themeRegistry[theme].className} ${sidePanelOpen ? "w-[78%]" : "w-full"} flex-col items-center justify-start px-4`}
                        >
                            <div className="absolute top-0 left-0 z-0 h-5 w-full bg-linear-to-b from-white to-transparent"></div>
                            <div className="h-5 w-full" role="presentation"></div>
                            <div
                                className="absolute top-0 left-0 h-[88vh] w-3 bg-linear-to-r from-white to-transparent"
                                role="presentation"
                            ></div>
                            <div
                                className="absolute top-0 right-0 h-[88vh] w-3 bg-linear-to-l from-white to-transparent"
                                role="presentation"
                            ></div>
                            <div
                                className="absolute bottom-0 left-0 z-10 h-3 w-full bg-linear-to-t from-white to-transparent"
                                role="presentation"
                            ></div>
                            <div className="grid grid-cols-2 gap-2">
                                {mockRows.map((row) => (
                                    <React.Fragment key={row}>
                                        {[1, 2].map((col) => {
                                            const element = elements.find(
                                                (e) => e.position.row === row && e.position.col === col,
                                            );
                                            return (
                                                <WidgetSlot
                                                    key={`${row}-${col}`}
                                                    id={`${row}-${col}`}
                                                    odd={col === 2}
                                                    elements={elements}
                                                    setElements={setElements}
                                                    rowCount={rowCount}
                                                    setRowCount={setRowCount}
                                                >
                                                    {element && (
                                                        <Widget
                                                            key={element.id}
                                                            id={`${row}-${col}-${element.id}`}
                                                            isDropped
                                                            type={element.type as WidgetType}
                                                            defaultProps={element.content}
                                                            onPropsChange={(newProps) =>
                                                                handlePropsChange(
                                                                    `${row}-${col}-${element.id}`,
                                                                    newProps,
                                                                )
                                                            }
                                                            dbId={dashboard.dashboardId}
                                                            profileId={profileId}
                                                        />
                                                    )}
                                                </WidgetSlot>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                                <button
                                    className="border-neutral col-span-2 flex w-full cursor-pointer flex-row items-center justify-center space-x-3 rounded-xl border bg-white py-4 text-neutral-600 shadow hover:bg-neutral-100"
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
                                    value={lastOpenTab}
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
                                            {["admin", "owner"].includes(role) && (
                                                <TabsTrigger value="users">
                                                    <LuUsers />
                                                    {t("users")}
                                                </TabsTrigger>
                                            )}
                                        </TabsList>
                                    </div>
                                    <TabsContent value="widgets">
                                        <div className="relative flex h-full w-full flex-col items-start justify-start space-y-2 px-4">
                                            <DeleteTarget show={showDelete && isDragging} />
                                            {/* <Widget
                                                id={`0-0-${decimalTranslator.generate()}`}
                                                type={WidgetType.TEST}
                                                defaultProps={{}}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`0-0-${decimalTranslator.generate()}`, newProps)
                                                }
                                            /> */}
                                            <Widget
                                                id={`0-0-${decimalTranslator.generate()}`}
                                                type={WidgetType.CLOCK}
                                                defaultProps={{}}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`0-0-${decimalTranslator.generate()}`, newProps)
                                                }
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
                                            />
                                            <Widget
                                                id={`0-0-${decimalTranslator.generate()}`}
                                                type={WidgetType.ANNOUNCEMENT}
                                                defaultProps={{
                                                    title: "Announcement",
                                                    paragraph: "",
                                                    type: "info",
                                                }}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`0-0-${decimalTranslator.generate()}`, newProps)
                                                }
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
                                            />
                                            <Widget
                                                id={`0-0-${decimalTranslator.generate()}`}
                                                type={WidgetType.LINKS}
                                                defaultProps={{
                                                    links: `[{"label": "", "url": ""}]`,
                                                }}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`0-0-${decimalTranslator.generate()}`, newProps)
                                                }
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
                                            />
                                            <Widget
                                                id={`0-0-${decimalTranslator.generate()}`}
                                                type={WidgetType.EMBED}
                                                defaultProps={{
                                                    url: "",
                                                }}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`0-0-${decimalTranslator.generate()}`, newProps)
                                                }
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
                                            />
                                            <Widget
                                                id={`0-0-${decimalTranslator.generate()}`}
                                                type={WidgetType.NOTES}
                                                defaultProps={{
                                                    title: "Notes",
                                                    public: "true",
                                                    notes: `{"public": ""}`,
                                                }}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`0-0-${decimalTranslator.generate()}`, newProps)
                                                }
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
                                            />
                                            <Widget
                                                id={`0-0-${decimalTranslator.generate()}`}
                                                type={WidgetType.TASKS}
                                                defaultProps={{
                                                    title: "Tasks",
                                                    tasks: `[]`,
                                                }}
                                                onPropsChange={(newProps) =>
                                                    handlePropsChange(`0-0-${decimalTranslator.generate()}`, newProps)
                                                }
                                                dbId={dashboard.dashboardId}
                                                profileId={profileId}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="settings">
                                        <div className="flex w-full flex-col items-center justify-start space-y-3 pr-2 pl-4">
                                            <div className="flex w-full flex-row items-center justify-between space-x-2 px-6 py-2">
                                                <label htmlFor="theme" className="w-1/3">
                                                    {t("theme")}
                                                </label>
                                                <Select
                                                    name="theme"
                                                    value={theme}
                                                    onValueChange={(value) => setTheme(value as themeTypes)}
                                                >
                                                    <SelectTrigger className="w-2/3">
                                                        <SelectValue placeholder={t("theme")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.values(themeTypes).map((theme) => (
                                                                <SelectItem key={theme} value={theme}>
                                                                    {t(`themeTypes.${theme}`)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Separator className="w-full" />
                                            {role === "owner" && (
                                                <PrivateCheckbox
                                                    setCurrentUsers={setCurrentUsers}
                                                    users={users}
                                                    privateDashboard={privateDashboard}
                                                    setPrivateDashboard={setPrivateDashboard}
                                                    label={t("private")}
                                                    description={t("privateDescription")}
                                                    setUsersChanged={setUsersChanged}
                                                />
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="users">
                                        <div className="flex w-full flex-col items-center justify-start pr-2 pl-6">
                                            <div className="flex w-full flex-col items-center justify-start space-y-4 pr-3">
                                                <OwnerCard profileId={uuidToShort(dashboard.ownerId)} />
                                                <Separator className="w-full" />
                                                <div
                                                    className={`${privateDashboard ? "flex" : "hidden"} w-full flex-col items-center justify-center space-y-3 rounded-md bg-neutral-100 px-6 py-4 text-xs text-neutral-500`}
                                                >
                                                    <LuCircleOff className="size-5" />
                                                    <span className="text-center">{t("addToPrivateDashboard")}</span>
                                                </div>
                                            </div>
                                            <ScrollArea
                                                className={`h-[59vh] w-full pr-3 ${privateDashboard ? "hidden" : "flex"}`}
                                            >
                                                <div className="flex w-full flex-col items-center justify-start space-y-4">
                                                    {currentUsers.map((user) => (
                                                        <UserCard
                                                            key={user.profile?.profileId}
                                                            profile={user}
                                                            currentUsers={currentUsers}
                                                            setCurrentUsers={setCurrentUsers}
                                                            setUsersChanged={setUsersChanged}
                                                        />
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                            <div className="my-4 flex w-full flex-row items-center justify-center pr-3">
                                                <button
                                                    className="flex w-full cursor-pointer flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs shadow hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white md:text-sm"
                                                    type="button"
                                                    disabled={privateDashboard}
                                                    onClick={() => setAddUserOpen(true)}
                                                >
                                                    <LuUserPlus className="size-5" />
                                                    <span>{t("addUser")}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </DragDropProvider>
                </div>
                <AddUserDialog
                    opened={addUserOpen}
                    onOpenChange={(open) => setAddUserOpen(open)}
                    currentUsers={currentUsers}
                    setCurrentUsers={setCurrentUsers}
                    dashboardId={dashboard.dashboardId}
                    ownerId={dashboard.ownerId}
                    setUsersChanged={setUsersChanged}
                />
            </div>
            <div className="flex w-full flex-col items-center justify-start py-4 md:hidden">
                <div className="flex w-[90%] flex-col items-center justify-start space-y-2">
                    <Tabs
                        className="w-full"
                        value={lastOpenTab === "widgets" ? "settings" : lastOpenTab}
                        onValueChange={(value) => setLastOpenTab(value)}
                    >
                        <div className="flex w-full flex-row items-center justify-center py-3">
                            <TabsList>
                                <TabsTrigger value="settings">
                                    <LuSlidersHorizontal />
                                    {t("settings")}
                                </TabsTrigger>
                                {["admin", "owner"].includes(role) && (
                                    <TabsTrigger value="users">
                                        <LuUsers />
                                        {t("users")}
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>
                        <TabsContent value="settings">
                            <div className="flex w-full flex-col items-start justify-start space-y-4">
                                {["admin", "owner"].includes(role) && (
                                    <>
                                        <label className="mr-2 text-xs text-neutral-600 md:text-sm">{t("icon")}</label>
                                        <Popover>
                                            <PopoverTrigger asChild disabled={!["admin", "owner"].includes(role)}>
                                                <button
                                                    className={`${notoColorEmoji.className} group relative flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-white px-1.5 py-1.5 text-3xl shadow disabled:cursor-default disabled:bg-neutral-50`}
                                                    type="button"
                                                >
                                                    {icon}
                                                    <div className="pointer-events-none absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-full bg-blue-300/20 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 group-disabled:hidden">
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
                                    </>
                                )}
                                {["admin", "owner"].includes(role) && (
                                    <>
                                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                                            <label htmlFor="title" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                                {t("title")}
                                            </label>
                                            <label
                                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow outline-0 outline-red-500/50 focus-within:border-blue-500 has-data-[error=true]:outline-4"
                                                htmlFor="title"
                                            >
                                                <div className="flex w-[8%] text-neutral-400">
                                                    <LuCaseSensitive role="presentation" />
                                                    <span className="sr-only">{t("title")}</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    className="flex w-[92%] py-1 text-sm focus:outline-0 md:text-base"
                                                    autoComplete="off"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                            </label>
                                        </div>
                                        <Separator className="w-full" />
                                    </>
                                )}
                                <div className="flex w-full flex-row items-center justify-between space-x-2 px-2 py-2">
                                    <label htmlFor="theme" className="w-1/3">
                                        {t("theme")}
                                    </label>
                                    <Select
                                        name="theme"
                                        value={theme}
                                        onValueChange={(value) => setTheme(value as themeTypes)}
                                    >
                                        <SelectTrigger className="w-2/3">
                                            <SelectValue placeholder={t("theme")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.values(themeTypes).map((theme) => (
                                                    <SelectItem key={theme} value={theme}>
                                                        {t(`themeTypes.${theme}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator className="w-full" />
                                {role === "owner" && (
                                    <PrivateCheckbox
                                        setCurrentUsers={setCurrentUsers}
                                        users={users}
                                        privateDashboard={privateDashboard}
                                        setPrivateDashboard={setPrivateDashboard}
                                        label={t("private")}
                                        description={t("privateDescription")}
                                        setUsersChanged={setUsersChanged}
                                    />
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="users">
                            <div className="flex w-full flex-col items-center justify-start">
                                <div className="flex w-full flex-col items-center justify-start space-y-4 pr-3">
                                    <OwnerCard profileId={uuidToShort(dashboard.ownerId)} />
                                    <Separator className="w-full" />
                                    <div
                                        className={`${privateDashboard ? "flex" : "hidden"} w-full flex-col items-center justify-center space-y-3 rounded-md bg-neutral-100 px-6 py-4 text-xs text-neutral-500`}
                                    >
                                        <LuCircleOff className="size-5" />
                                        <span className="text-center">{t("addToPrivateDashboard")}</span>
                                    </div>
                                </div>
                                <ScrollArea className={`h-[58vh] w-full pr-3 ${privateDashboard ? "hidden" : "flex"}`}>
                                    <div className="flex w-full flex-col items-center justify-start space-y-4">
                                        {currentUsers.map((user) => (
                                            <UserCard
                                                key={user.profile?.profileId}
                                                profile={user}
                                                currentUsers={currentUsers}
                                                setCurrentUsers={setCurrentUsers}
                                                setUsersChanged={setUsersChanged}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="my-4 flex w-full flex-row items-center justify-center pr-3">
                                    <button
                                        className="flex w-full cursor-pointer flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs shadow hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white md:text-sm"
                                        type="button"
                                        disabled={privateDashboard}
                                        onClick={() => setAddUserOpen(true)}
                                    >
                                        <LuUserPlus className="size-4" />
                                        <span>{t("addUser")}</span>
                                    </button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="absolute right-[5%] bottom-2 left-[5%] flex w-[90%] flex-row items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/50 p-2 shadow backdrop-blur-md md:right-[10%] md:left-[10%] md:w-[80%] md:rounded-2xl md:p-4">
                        <Link
                            href={`/app/dashboard/${uuidToShort(dashboard.dashboardId)}`}
                            className="flex flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm"
                        >
                            <LuMoveLeft />
                            <span>{t("cancel")}</span>
                        </Link>
                        <button
                            className="group flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm"
                            onClick={() => handleSubmit()}
                            disabled={submitted}
                        >
                            <span className="text-xs md:text-sm">{t("submit")}</span>
                            <LuCheck className="block size-3 group-disabled:hidden" />
                            <LuLoaderCircle className="hidden size-3 animate-spin group-disabled:block" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
