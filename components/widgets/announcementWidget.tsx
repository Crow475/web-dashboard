"use client";

import { useContext } from "react";

import { WidgetDataContex } from "@/components/custom/widget";
import { WidgetDataContexRegular } from "@/components/custom/widgetRegular";

import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";

import { LuCircleAlert, LuTriangleAlert } from "react-icons/lu";

import { useTranslations } from "next-intl";

type announcementProps = {
    title: string;
    paragraph?: string;
    type: string;
};

function AnnouncementExpanded() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as announcementProps;

    const type = state.type as "info" | "warning" | "alert";

    return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-b-xl bg-white">
            <div className="flex w-full flex-row items-center justify-center">
                {type === "warning" && <LuCircleAlert className="size-10 text-amber-400" />}
                {type === "alert" && <LuTriangleAlert className="size-10 text-red-500" />}
            </div>
            <div className="flex w-full flex-row items-center justify-center px-4 py-2">
                <h1
                    className={`text-center text-3xl font-bold ${type === "info" ? "text-black" : type === "warning" ? "text-amber-400" : "text-red-500"}`}
                >
                    {state.title}
                </h1>
            </div>
            <div className="flex w-full flex-row items-center justify-center px-4 py-2">
                <p className="text-center text-sm">{state.paragraph}</p>
            </div>
        </div>
    );
}

function AnnouncementSettings() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as announcementProps;
    const { setWidgetProps } = value;

    const t = useTranslations("component.widgets.announcement");

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-b-xl bg-white px-4 py-3">
            <div className="flex w-full flex-row items-center justify-start space-x-2 px-4 py-2">
                <label htmlFor="type" className="w-1/4">
                    {t("type")}:
                </label>
                <Select
                    onValueChange={(value) => {
                        setWidgetProps({ ...state, type: value });
                    }}
                    value={state.type}
                >
                    <SelectTrigger className="w-3/4">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="info">{t("info")}</SelectItem>
                            <SelectItem value="warning">{t("warning")}</SelectItem>
                            <SelectItem value="alert">{t("alert")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-full flex-row items-center justify-start space-x-2 px-4 py-2">
                <label htmlFor="title" className="w-1/4">
                    {t("titleLabel")}:
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-3/4 rounded-md border border-neutral-200 px-1 py-1"
                    value={state.title}
                    onChange={(e) => {
                        setWidgetProps({ ...state, title: e.target.value });
                    }}
                    placeholder={t("titlePlaceholder")}
                    autoComplete="off"
                />
            </div>
            <div className="flex w-full flex-row items-start justify-start space-x-2 px-4 py-2">
                <label htmlFor="paragraph" className="w-1/4">
                    {t("paragraphLabel")}:
                </label>
                <textarea
                    className="h-40 w-3/4 resize-none rounded-md border border-neutral-200 px-1 py-1"
                    value={state.paragraph}
                    onChange={(e) => {
                        setWidgetProps({ ...state, paragraph: e.target.value });
                    }}
                />
            </div>
        </div>
    );
}

function AnnouncementRegular() {
    const value = useContext(WidgetDataContexRegular);
    const state = value.widgetProps as announcementProps;

    const type = state.type as "info" | "warning" | "alert";

    return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-white">
            <div className="flex w-full flex-row items-center justify-center">
                {type === "warning" && <LuCircleAlert className="size-10 text-amber-400" />}
                {type === "alert" && <LuTriangleAlert className="size-10 text-red-500" />}
            </div>
            <div className="flex w-full flex-row items-center justify-center px-4 py-2">
                <h1
                    className={`text-center text-2xl font-bold md:text-3xl ${type === "info" ? "text-black" : type === "warning" ? "text-amber-400" : "text-red-500"}`}
                >
                    {state.title}
                </h1>
            </div>
            <div className="flex w-full flex-row items-center justify-center px-4 py-2">
                <p className="text-center text-xs md:text-sm">{state.paragraph}</p>
            </div>
        </div>
    );
}

export const AnnouncementWidget = {
    name: "announcement",
    expanded: <AnnouncementExpanded />,
    regular: <AnnouncementRegular />,
    settings: <AnnouncementSettings />,
};
