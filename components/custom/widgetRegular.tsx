"use client";

import { useState, createContext } from "react";

import type { dashboardElement } from "@/lib/types";
import { WidgetList, WidgetType } from "@/lib/widgetRegistry";

export const WidgetDataContexRegular = createContext<{
    widgetProps: unknown;
    id: string;
    dashboardId: string;
    profileId: string;
    setWidgetProps: (widgetProps: { [key: string]: string }) => void;
}>({ widgetProps: {}, setWidgetProps: () => {}, id: "", dashboardId: "", profileId: "" });

export default function WidgetRegular({
    widget,
    dbId,
    profileId,
}: {
    widget: dashboardElement;
    dbId: string;
    profileId: string;
}) {
    const [widgetProps, setWidgetProps] = useState<{ [key: string]: string }>(widget.content);
    const type: WidgetType = widget.type as WidgetType;

    console.log(widgetProps);

    return (
        <div className="flex h-full w-full flex-col justify-start space-x-2 rounded-xl border border-neutral-200 bg-white">
            <WidgetDataContexRegular.Provider
                value={{
                    widgetProps: widgetProps,
                    id: widget.id,
                    setWidgetProps: setWidgetProps,
                    dashboardId: dbId,
                    profileId: profileId,
                }}
            >
                {WidgetList[type].regular}
            </WidgetDataContexRegular.Provider>
        </div>
    );
}
