"use client";

import { useState, useEffect, useContext } from "react";
import { WidgetDataContex } from "@/components/custom/widget";
import { WidgetDataContexRegular } from "@/components/custom/widgetRegular";

import { useTranslations } from "next-intl";

import { widgetCombo } from "@/lib/types";

type clockProps = {
    showSeconds: string;
    showDate: string;
};

function ClockExpanded() {
    const [time, setTime] = useState(new Date());
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as clockProps;

    useEffect(() => {
        setInterval(() => setTime(new Date()), 1000);
    }, []);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-b-xl bg-white">
            {state.showSeconds === "true" ? (
                <span className="text-3xl">
                    {time.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
            ) : (
                <span className="text-5xl">{time.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
            )}
            {state.showDate === "true" && (
                <span className="text-lg">
                    {time.toLocaleString("en-GB", { weekday: "long", month: "long", day: "numeric" })}
                </span>
            )}
        </div>
    );
}

function ClockSettings() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as clockProps;
    const { setWidgetProps } = value;

    const t = useTranslations("component.widgets.clock");

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-b-xl bg-white px-4 py-3">
            <div className="flex w-full flex-row items-center justify-start space-x-2">
                <label htmlFor="showSeconds" className="w-2/3">
                    {t("showSeconds")}
                </label>
                <input
                    type="checkbox"
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm shadow outline-0 focus-within:border-blue-500"
                    id="showSeconds"
                    name="showSeconds"
                    checked={state.showSeconds === "true"}
                    onChange={(e) =>
                        setWidgetProps({ showDate: state.showDate, showSeconds: e.target.checked ? "true" : "false" })
                    }
                />
            </div>
            <div className="flex w-full flex-row items-center justify-start space-x-2">
                <label htmlFor="showDate" className="w-2/3">
                    {t("showDate")}
                </label>
                <input
                    type="checkbox"
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm shadow outline-0 focus-within:border-blue-500"
                    id="showDate"
                    name="showDate"
                    checked={state.showDate === "true"}
                    onChange={(e) =>
                        setWidgetProps({
                            showDate: e.target.checked ? "true" : "false",
                            showSeconds: state.showSeconds,
                        })
                    }
                />
            </div>
        </div>
    );
}

function ClockRegular() {
    const [time, setTime] = useState(new Date());
    const value = useContext(WidgetDataContexRegular);
    const state = value.widgetProps as clockProps;

    useEffect(() => {
        setInterval(() => setTime(new Date()), 1000);
    }, []);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-white">
            {state.showSeconds === "true" ? (
                <span className="text-3xl">
                    {time.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
            ) : (
                <span className="text-5xl">{time.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
            )}
            {state.showDate === "true" && (
                <span className="text-lg">
                    {time.toLocaleString("en-GB", { weekday: "long", month: "long", day: "numeric" })}
                </span>
            )}
        </div>
    );
}

export const ClockWidget: widgetCombo = {
    name: "clock",
    expanded: <ClockExpanded />,
    regular: <ClockRegular />,
    settings: <ClockSettings />,
};
