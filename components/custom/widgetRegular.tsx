"use client";

import { useState, createContext } from "react";

import type { dashboardElement } from "@/lib/types";
import { WidgetList, WidgetType } from "@/lib/widgetRegistry";

export const WidgetDataContexRegular = createContext<{
    widgetProps: unknown;
    setWidgetProps: (widgetProps: { [key: string]: string }) => void;
}>({ widgetProps: {}, setWidgetProps: () => {} });

export default function WidgetRegular({ widget }: { widget: dashboardElement }) {
    const [widgetProps, setWidgetProps] = useState<{ [key: string]: string }>(widget.content);
    const type: WidgetType = widget.type as WidgetType;

    console.log(widgetProps);

    return (
        <div className="flex h-full w-full flex-col justify-start space-x-2 rounded-xl border border-neutral-200 bg-white">
            <WidgetDataContexRegular.Provider value={{ widgetProps: widgetProps, setWidgetProps: setWidgetProps }}>
                {WidgetList[type].regular}
            </WidgetDataContexRegular.Provider>
        </div>
    );
}
