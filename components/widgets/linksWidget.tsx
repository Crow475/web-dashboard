"use client";
import { useContext, useState } from "react";

import { WidgetDataContex } from "@/components/custom/widget";
import { WidgetDataContexRegular } from "@/components/custom/widgetRegular";

import { widgetCombo } from "@/lib/types";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { LuCheck, LuX, LuPlus } from "react-icons/lu";

import { useTranslations } from "next-intl";

type linksProps = {
    links: { url: string; label: string }[];
    title?: string;
};

type stringifiedLinksProps = {
    links: string;
    title?: string;
};

function LinksExpanded() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as stringifiedLinksProps;

    console.log("State: ", state);
    console.log("Links: ", state.links);

    const links: linksProps["links"] = JSON.parse(state.links);
    const title = state.title ?? "Links";

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-b-xl bg-white">
            <div className="flex w-full flex-row items-center justify-start px-4 py-2">
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>
            <div className="flex w-full flex-col items-center justify-start px-3">
                <ScrollArea className="flex h-64 w-full overflow-y-hidden">
                    <div className="flex w-full flex-col items-center justify-start space-y-1 py-3">
                        {links.map((link, id) => (
                            <div
                                className="flex w-full flex-row items-center justify-start space-x-2 px-4"
                                key={`links-${id}-${link.url}`}
                            >
                                <a
                                    href={link.url}
                                    className="text-lg text-blue-500 underline hover:text-blue-600"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {link.label}
                                </a>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

function LinksSettings() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as stringifiedLinksProps;
    const { setWidgetProps } = value;
    const { setShowSettings } = value;

    const links: linksProps["links"] = JSON.parse(state.links);

    const [linkList, setLinkList] = useState(links);
    const [title, setTitle] = useState(state.title ?? "Links");
    const [edited, setEdited] = useState(false);

    const t = useTranslations("component.widgets.links");

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-b-xl bg-white px-4 py-3">
            <div className="flex w-full flex-row items-center justify-start space-x-2 px-4 py-2">
                <label htmlFor="title" className="w-1/4">
                    {t("titleLabel")}:
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-3/4 rounded-md border border-neutral-200 px-1 py-1"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setEdited(true);
                    }}
                    autoComplete="off"
                />
            </div>
            <Separator orientation="horizontal" />
            <ScrollArea className="flex h-64 w-full overflow-y-hidden">
                <div className="flex w-full flex-col items-center justify-start space-y-2 py-3">
                    {linkList.map((link, id) => (
                        <div
                            key={`links-${id}`}
                            className="group flex w-full flex-row items-end justify-start space-x-2 px-4"
                        >
                            <label
                                htmlFor={`links-${id}-label`}
                                className="flex w-[47%] flex-col items-start justify-start space-y-1"
                            >
                                <span className="hidden text-xs text-neutral-500 group-first:block">
                                    {t("linkLabelLabel")}:
                                </span>
                                <input
                                    type="text"
                                    id={`links-${id}-label`}
                                    name={`links-${id}-label`}
                                    className="w-full rounded-md border border-neutral-200 px-1 py-1"
                                    autoComplete="off"
                                    placeholder={t("linkLabelPlaceholder")}
                                    value={link.label}
                                    onChange={(e) => {
                                        setEdited(true);
                                        setLinkList(
                                            linkList.map((link, i) =>
                                                i === id ? { ...link, label: e.target.value } : link,
                                            ),
                                        );
                                    }}
                                />
                            </label>
                            <label
                                htmlFor={`links-${id}-url`}
                                className="flex w-[47%] flex-col items-start justify-start space-y-1"
                            >
                                <span className="hidden text-xs text-neutral-500 group-first:block">
                                    {t("linkUrlLabel")}:
                                </span>
                                <input
                                    type="text"
                                    id={`links-${id}-url`}
                                    name={`links-${id}-url`}
                                    className="w-full rounded-md border border-neutral-200 px-1 py-1"
                                    autoComplete="off"
                                    placeholder="https://example.com"
                                    value={link.url}
                                    onChange={(e) => {
                                        setEdited(true);
                                        setLinkList(
                                            linkList.map((link, i) =>
                                                i === id ? { ...link, url: e.target.value } : link,
                                            ),
                                        );
                                    }}
                                />
                            </label>
                            <button
                                className="flex w-[6%] cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-neutral-300 bg-white px-1.5 py-2 text-xs hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white"
                                type="button"
                                title={t("remove")}
                                onClick={() => {
                                    setEdited(true);
                                    setLinkList(linkList.filter((_, i) => i !== id));
                                }}
                            >
                                <LuX className="size-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        className="flex w-1/6 cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-neutral-300 bg-white p-1.5 text-xs hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-white"
                        type="button"
                        title={t("add")}
                        onClick={() => {
                            setEdited(true);
                            setLinkList([...linkList, { url: "", label: "" }]);
                        }}
                    >
                        <LuPlus className="size-4" />
                    </button>
                    <div className="flex h-8 w-full"></div>
                    <button
                        className={`absolute right-5 bottom-1 z-10 ${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-blue-400 bg-blue-500 px-2 py-1.5 text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm`}
                        type="button"
                        onClick={() => {
                            setWidgetProps({ links: JSON.stringify(linkList), title: title.trim() });
                            setShowSettings(false);
                        }}
                    >
                        <span className="text-sm">{t("save")}</span>
                        <LuCheck />
                    </button>
                </div>
            </ScrollArea>
        </div>
    );
}

function LinksRegular() {
    const value = useContext(WidgetDataContexRegular);
    const state = value.widgetProps as stringifiedLinksProps;

    const links: linksProps["links"] = JSON.parse(state.links);
    const title = state.title ?? "Links";

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white">
            <div className="flex w-full flex-row items-center justify-start px-4 py-2">
                <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            </div>
            <div className="flex w-full flex-col items-center justify-start px-3">
                <ScrollArea className="flex h-72 w-full overflow-y-hidden">
                    <div className="flex w-full flex-col items-center justify-start space-y-1 py-3">
                        {links.map((link, id) => (
                            <div
                                className="flex w-full flex-row items-center justify-start space-x-2 px-4"
                                key={`links-${id}-${link.url}`}
                            >
                                <a
                                    href={link.url}
                                    className="text-base text-blue-500 underline hover:text-blue-600 md:text-lg"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {link.label}
                                </a>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

export const LinksWidget: widgetCombo = {
    name: "links",
    expanded: <LinksExpanded />,
    regular: <LinksRegular />,
    settings: <LinksSettings />,
};
