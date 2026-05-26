"use client";

import { useRef, createContext, useState } from "react";
import { useDraggable } from "@dnd-kit/react";

import { LuGripVertical, LuSettings } from "react-icons/lu";

import { WidgetList, WidgetType } from "@/lib/widgetRegistry";

import { useTranslations } from "next-intl";

export const WidgetDataContex = createContext<{
    widgetProps: unknown;
    setWidgetProps: (widgetProps: { [key: string]: string }) => void;
    setShowSettings: (showSettings: boolean) => void;
}>({ widgetProps: {}, setWidgetProps: () => {}, setShowSettings: () => {} });

export default function Widget({
    isDropped,
    id,
    type,
    defaultProps,
    onPropsChange,
}: {
    isDropped?: boolean;
    id: string;
    type: WidgetType;
    defaultProps: { [key: string]: string };
    onPropsChange: (widgetProps: { [key: string]: string }) => void;
}) {
    const handleRef = useRef<HTMLDivElement>(null);
    const [widgetProps, setWidgetProps] = useState<{ [key: string]: string }>(defaultProps);
    const [showSettings, setShowSettings] = useState(false);

    const t = useTranslations("component.widgets");

    const { ref } = useDraggable({
        id: id,
        handle: handleRef,
        data: {
            type: type,
            props: widgetProps,
        },
    });

    const expanded = isDropped;

    function handlePropsChange(newProps: { [key: string]: string }) {
        setWidgetProps(newProps);
        onPropsChange(newProps);
    }

    return (
        <div
            ref={ref}
            className={`flex w-full flex-col justify-start space-x-2 border border-neutral-200 bg-white transition-all duration-100 ${expanded ? "h-full w-full rounded-xl" : "items-center rounded-md"}`}
        >
            <WidgetDataContex.Provider
                value={{
                    widgetProps: widgetProps,
                    setWidgetProps: handlePropsChange,
                    setShowSettings: setShowSettings,
                }}
            >
                <div
                    className={`flex w-full flex-row items-center justify-between bg-neutral-50 py-1 pr-2 ${expanded ? "rounded-t-xl border-b border-neutral-200" : "rounded-t-md rounded-b-md"}`}
                >
                    <div className="flex flex-row items-center justify-start space-x-1">
                        <div ref={handleRef} className="cursor-grab pl-1">
                            <LuGripVertical size={expanded ? 16 : 20} />
                        </div>
                        <span className={expanded ? "text" : "text-lg"}>{t(`${WidgetList[type].name}.title`)}</span>
                    </div>
                    <div className="flex flex-row items-center justify-end space-x-1">
                        {WidgetList[type].settings && expanded && (
                            <button
                                className="flex cursor-pointer flex-row items-center justify-center rounded-md bg-transparent p-1 hover:bg-neutral-200 active:bg-neutral-300"
                                onClick={() => setShowSettings(!showSettings)}
                                title={t("general.settings")}
                            >
                                <LuSettings />
                            </button>
                        )}
                    </div>
                </div>
                {expanded && !showSettings ? WidgetList[type].expanded : null}
                {WidgetList[type].settings && expanded && showSettings ? WidgetList[type].settings : null}
            </WidgetDataContex.Provider>
        </div>
    );
}
