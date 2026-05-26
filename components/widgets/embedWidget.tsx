import { useContext } from "react";

import { WidgetDataContex } from "@/components/custom/widget";
import { WidgetDataContexRegular } from "@/components/custom/widgetRegular";

import { widgetCombo } from "@/lib/types";

import { useTranslations } from "next-intl";

type embedProps = {
    url: string;
};

function EmbedExpanded() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as embedProps;

    const t = useTranslations("component.widgets.embed");

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-b-xl bg-white">
            {state.url && (
                <iframe
                    src={state.url}
                    className="h-full w-full rounded-b-xl border border-neutral-200 bg-white"
                    title="Embedded content"
                />
            )}
            <div className="hidden h-full w-full flex-col items-center justify-center px-4 py-2 only:flex">
                <span className="text-2xl font-bold text-neutral-700">{t("placeholderTitle")}</span>
                <p className="text-center text-neutral-400">{t("placeholderParagraph")}</p>
            </div>
        </div>
    );
}

function EmbedSettings() {
    const value = useContext(WidgetDataContex);
    const state = value.widgetProps as embedProps;
    const { setWidgetProps } = value;

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-b-xl bg-white px-4 py-3">
            <div className="flex w-full flex-row items-center justify-start space-x-2 px-4 py-2">
                <label htmlFor="url" className="w-1/4">
                    {`URL:`}
                </label>
                <input
                    type="text"
                    id="url"
                    name="url"
                    className="w-3/4 rounded-md border border-neutral-200 px-1 py-1"
                    value={state.url}
                    onChange={(e) => {
                        setWidgetProps({ url: e.target.value });
                    }}
                    autoComplete="off"
                />
            </div>
        </div>
    );
}

function EmbedRegular() {
    const value = useContext(WidgetDataContexRegular);
    const state = value.widgetProps as embedProps;

    const t = useTranslations("component.widgets.embed");

    return (
        <div className="flex h-full w-full flex-col items-center justify-start rounded-xl bg-white">
            {state.url && (
                <iframe
                    src={state.url}
                    className="h-full w-full rounded-xl border border-neutral-200 bg-white"
                    title="Embedded content"
                    allowFullScreen
                />
            )}
            <div className="hidden h-full w-full flex-col items-center justify-center px-4 py-2 only:flex">
                <span className="text-2xl font-bold text-neutral-700">{t("placeholderTitle")}</span>
                <p className="text-center text-neutral-400">{t("placeholderParagraph")}</p>
            </div>
        </div>
    );
}

export const EmbedWidget: widgetCombo = {
    name: "embed",
    expanded: <EmbedExpanded />,
    regular: <EmbedRegular />,
    settings: <EmbedSettings />,
};
