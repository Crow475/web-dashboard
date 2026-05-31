"use client";

import { useContext, useState } from "react";

import { WidgetDataContex } from "@/components/custom/widget";
import { WidgetDataContexRegular } from "@/components/custom/widgetRegular";
import { toast } from "sonner";

import { widgetCombo } from "@/lib/types";

import { updateWidget } from "@/actions/updateWidget";

import { LuCheck, LuUndo2 } from "react-icons/lu";

import { useTranslations } from "next-intl";

type notesProps = {
    title?: string;
    public: string;
    notes?: string;
};

type notesParsed = {
    public: string;
    [key: string]: string;
};

function NotesExpanded() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as notesProps;
    const setWidgetProps = value.setWidgetProps;
    const id = value.id;
    const dashboardId = value.dashboardId;
    const profileId = value.profileId;

    const isPublic = state.public === "true";
    const notes = JSON.parse(state.notes ?? `{"public": ""}`) as notesParsed;

    const [publicNote, setPublicNote] = useState(isPublic ? (notes.public ?? "") : "");
    const [personalNote, setPersonalNote] = useState(isPublic ? "" : (notes[profileId] ?? ""));
    const [edited, setEdited] = useState(false);

    const t = useTranslations("component.widgets.notes");

    function handleSave() {
        if (isPublic) {
            setWidgetProps({
                ...state,
                notes: JSON.stringify({ public: publicNote }),
            });

            const result = updateWidget(dashboardId, id.split("-")[2], {
                public: "true",
                title: state.title ?? "",
                notes: JSON.stringify({ public: publicNote }),
            });

            if (!result) {
                toast.error(t("saveFailure"));
                return;
            }

            toast.success(t("saveSuccess"));
            setEdited(false);
        } else {
            setWidgetProps({
                ...state,
                notes: JSON.stringify({ ...notes, [profileId]: personalNote }),
            });

            const result = updateWidget(dashboardId, id, {
                public: "false",
                title: state.title ?? "",
                notes: JSON.stringify({ ...notes, [profileId]: personalNote }),
            });

            if (!result) {
                toast.error(t("saveFailure"));
                return;
            }

            toast.success(t("saveSuccess"));
            setEdited(false);
        }
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white">
            <div className="flex w-full flex-row items-center justify-between pt-2 pr-2 pl-4">
                <h1 className="line-clamp-1 text-2xl font-bold md:text-3xl">{state.title}</h1>
                <div className="flex flex-row items-center justify-end space-x-1">
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-neutral-300 bg-white px-2 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm`}
                        title={t("undoChanges")}
                        onClick={() => {
                            setPublicNote(state.public === "true" ? notes.public : "");
                            setPersonalNote(state.public === "true" ? "" : notes[profileId]);
                            setEdited(false);
                        }}
                    >
                        <LuUndo2 className="size-3 md:size-4" />
                    </button>
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-blue-400 bg-blue-500 px-2 py-1.5 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm`}
                        onClick={() => handleSave()}
                    >
                        <span>{t("save")}</span>
                        <LuCheck />
                    </button>
                </div>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-start px-2 pt-2 pb-1">
                {isPublic && (
                    <textarea
                        className="h-full w-full resize-none rounded-md border border-neutral-200 px-1 py-1"
                        value={publicNote}
                        onChange={(e) => {
                            setEdited(true);
                            setPublicNote(e.target.value);
                        }}
                    />
                )}
                {!isPublic && (
                    <textarea
                        className="h-full w-full resize-none rounded-md border border-neutral-200 px-1 py-1"
                        value={personalNote}
                        onChange={(e) => {
                            setEdited(true);
                            setPersonalNote(e.target.value);
                        }}
                    />
                )}
            </div>
            <div className="flex w-full flex-row items-center justify-between px-2 pb-1">
                <div className="space-x-0.5 rounded-sm px-1.5 text-[0.6rem] text-neutral-600 select-none md:text-xs">
                    <span>{isPublic ? publicNote.length : personalNote.length}</span>
                    <span>{t("characters")}</span>
                </div>
                <div className="space-x-0.5 rounded-sm bg-neutral-50 px-1.5 text-[0.6rem] text-neutral-600 select-none md:text-xs">
                    <span className={`${isPublic ? "text-red-600" : "text-green-600"}`}>●</span>
                    <span>{isPublic ? t("public") : t("private")}</span>
                </div>
            </div>
        </div>
    );
}

function NotesSettings() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as notesProps;
    const { setWidgetProps } = value;

    const t = useTranslations("component.widgets.notes");

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white">
            <div className="flex w-full flex-row items-center justify-start space-x-2 px-4 py-2">
                <label htmlFor="title" className="w-1/4">
                    {t("titleLabel")}
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
                    autoComplete="off"
                />
            </div>
            <div className="flex w-full flex-row items-center justify-start space-x-2 px-4 py-2">
                <label htmlFor="publicCheckbox" className="w-1/4">
                    {t("publicLabel")}
                </label>
                <input
                    type="checkbox"
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm shadow outline-0 focus-within:border-blue-500"
                    id="publicCheckbox"
                    name="publicCheckbox"
                    checked={state.public === "true"}
                    onChange={(e) => setWidgetProps({ ...state, public: e.target.checked ? "true" : "false" })}
                />
            </div>
        </div>
    );
}

function NotesRegular() {
    const value = useContext(WidgetDataContexRegular);
    const state = value.widgetProps as notesProps;
    const id = value.id;
    const dashboardId = value.dashboardId;
    const profileId = value.profileId;

    const isPublic = state.public === "true";
    const notes = JSON.parse(state.notes ?? `{"public": ""}`) as notesParsed;

    const [publicNote, setPublicNote] = useState(isPublic ? (notes.public ?? "") : "");
    const [personalNote, setPersonalNote] = useState(isPublic ? "" : (notes[profileId] ?? ""));
    const [edited, setEdited] = useState(false);

    const t = useTranslations("component.widgets.notes");

    function handleSave() {
        if (isPublic) {
            const result = updateWidget(dashboardId, id, {
                public: "true",
                title: state.title ?? "",
                notes: JSON.stringify({ public: publicNote }),
            });

            if (!result) {
                toast.error(t("saveFailure"));
                return;
            }

            toast.success(t("saveSuccess"));
            setEdited(false);
        } else {
            const result = updateWidget(dashboardId, id, {
                public: "false",
                title: state.title ?? "",
                notes: JSON.stringify({ ...notes, [profileId]: personalNote }),
            });

            if (!result) {
                toast.error(t("saveFailure"));
                return;
            }

            toast.success(t("saveSuccess"));
            setEdited(false);
        }
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white">
            <div className="flex w-full flex-row items-center justify-between pt-2 pr-2 pl-4">
                <h1 className="line-clamp-1 text-2xl font-bold md:text-3xl">{state.title}</h1>
                <div className="flex flex-row items-center justify-end space-x-1">
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-neutral-300 bg-white px-2 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm`}
                        title={t("undoChanges")}
                        onClick={() => {
                            setPublicNote(state.public === "true" ? notes.public : "");
                            setPersonalNote(state.public === "true" ? "" : notes[profileId]);
                            setEdited(false);
                        }}
                    >
                        <LuUndo2 className="size-3 md:size-4" />
                    </button>
                    <button
                        className={`${edited ? "flex" : "hidden"} cursor-pointer flex-row items-center justify-center space-x-1 rounded-md border border-blue-400 bg-blue-500 px-2 py-1.5 text-xs text-white shadow hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 md:text-sm`}
                        onClick={() => handleSave()}
                    >
                        <span>{t("save")}</span>
                        <LuCheck />
                    </button>
                </div>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-start px-2 pt-2 pb-1">
                {isPublic && (
                    <textarea
                        className="h-full w-full resize-none rounded-md border border-neutral-200 px-1 py-1"
                        value={publicNote}
                        onChange={(e) => {
                            setEdited(true);
                            setPublicNote(e.target.value);
                        }}
                    />
                )}
                {!isPublic && (
                    <textarea
                        className="h-full w-full resize-none rounded-md border border-neutral-200 px-1 py-1"
                        value={personalNote}
                        onChange={(e) => {
                            setEdited(true);
                            setPersonalNote(e.target.value);
                        }}
                    />
                )}
            </div>
            <div className="flex w-full flex-row items-center justify-between px-2 pb-1">
                <div className="space-x-0.5 rounded-sm px-1.5 text-[0.6rem] text-neutral-600 select-none md:text-xs">
                    <span>{isPublic ? publicNote.length : personalNote.length}</span>
                    <span>{t("characters")}</span>
                </div>
                <div className="space-x-0.5 rounded-sm bg-neutral-50 px-1.5 text-[0.6rem] text-neutral-600 select-none md:text-xs">
                    <span className={`${isPublic ? "text-red-600" : "text-green-600"}`}>●</span>
                    <span>{isPublic ? t("public") : t("private")}</span>
                </div>
            </div>
        </div>
    );
}

export const NotesWidget: widgetCombo = {
    name: "notes",
    expanded: <NotesExpanded />,
    regular: <NotesRegular />,
    settings: <NotesSettings />,
};
