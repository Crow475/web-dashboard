"use client";

import React from "react";
import { useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { LuPencil, LuMoveUpRight, LuLoaderCircle } from "react-icons/lu";

import type { dashboardProps, profilePreferences } from "@/lib/types";

import uuidToShort from "@/lib/uuidToShort";

import { notoColorEmoji } from "@/lib/fonts";
import { themeRegistry } from "@/lib/themeRegistry";

import { useTranslations } from "next-intl";

import { ScrollArea } from "@/components/ui/scroll-area";

import { DashboardContext } from "@/components/dashboardContext";
import WidgetRegular from "@/components/custom/widgetRegular";

import setLastOpened from "@/actions/setLastOpened";

function ElementAtPosition({
    row,
    col,
    props,
    id,
    profileId,
}: {
    row: number;
    col: number;
    props: dashboardProps;
    id: string;
    profileId: string;
}) {
    const element = props.elements.find((element) => element.position.row === row && element.position.col === col);

    if (!element) {
        return null;
    }

    return <WidgetRegular widget={element} dbId={id} profileId={profileId} />;
}

export default function DashboardPage() {
    const value = useContext(DashboardContext);
    const props = value.dashboard.properties as dashboardProps;
    const role = value.role;
    const dashboard = value.dashboard;
    const profile = value.profile;
    const id = uuidToShort(dashboard.dashboardId);

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function handleLastOpened() {
            const result = (await setLastOpened(dashboard.dashboardId)) as profilePreferences | null;
            if (result) {
                if (!(result.lastOpened === dashboard.dashboardId)) {
                    router.refresh();
                }
            }
        }

        handleLastOpened();
    }, [router, dashboard.dashboardId]);

    const t = useTranslations("dashboard");

    const mockRows = Array.from({ length: props.rows }, (_, i) => i + 1);

    return (
        <div className="flex h-svh w-full flex-col items-center justify-start">
            <header className="flex w-[98%] flex-row items-center justify-between border-b border-neutral-300 px-4 py-2 md:py-4">
                <div className="flex flex-row items-center justify-start space-x-2">
                    <div
                        className={`${notoColorEmoji.className} flex flex-row items-center justify-center text-2xl md:text-4xl`}
                    >
                        {dashboard.icon}
                    </div>
                    <h1 className="border border-transparent px-2 py-1 text-2xl font-bold md:text-4xl">
                        {dashboard.title}
                    </h1>
                </div>
                <div className="flex flex-row items-center justify-end">
                    {dashboard.ownerId === profile.profileId || ["admin", "editor"].includes(role ?? "") ? (
                        <Link
                            className="flex flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-4 py-2 text-neutral-500 shadow hover:border-amber-300 hover:bg-amber-200 hover:text-amber-500 hover:shadow-amber-200"
                            href={`/app/dashboard/${id}/edit`}
                            onNavigate={() => setLoading(true)}
                        >
                            {loading ? (
                                <LuLoaderCircle className="size-3 animate-spin" />
                            ) : (
                                <LuPencil className="size-3" />
                            )}
                            <span className="text-xs md:text-sm">{t("edit")}</span>
                        </Link>
                    ) : null}
                </div>
            </header>
            <div className="flex w-full flex-row items-center justify-center pr-1 md:pr-4">
                <ScrollArea
                    className={`flex h-[90vh] w-full flex-col items-center justify-start bg-fixed px-2 md:h-[88vh] md:px-4 ${themeRegistry[props.preferences.theme].className}`}
                >
                    <div className="absolute top-0 left-0 z-0 h-5 w-full bg-linear-to-b from-white to-transparent"></div>
                    <div className="h-5 w-full" role="presentation"></div>
                    <div
                        className="absolute top-0 left-0 h-[90vh] w-3 bg-linear-to-r from-white to-transparent md:h-[88vh]"
                        role="presentation"
                    ></div>
                    <div
                        className="absolute top-0 right-0 h-[90vh] w-3 bg-linear-to-l from-white to-transparent md:h-[88vh]"
                        role="presentation"
                    ></div>
                    <div
                        className="absolute bottom-0 left-0 z-10 h-3 w-full bg-linear-to-t from-white to-transparent"
                        role="presentation"
                    ></div>
                    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                        {mockRows.map((row) => (
                            <React.Fragment key={row}>
                                <div
                                    id={`${row}-1`}
                                    className="flex h-[33vh] w-full rounded-xl border border-neutral-100 empty:border-transparent md:h-[50vh]"
                                >
                                    <ElementAtPosition
                                        row={row}
                                        col={1}
                                        props={props}
                                        id={dashboard.dashboardId}
                                        profileId={profile.profileId}
                                    />
                                </div>
                                <div
                                    id={`${row}-2`}
                                    className="flex h-[33vh] w-full rounded-xl border border-neutral-100 empty:border-transparent md:h-[50vh]"
                                >
                                    <ElementAtPosition
                                        row={row}
                                        col={2}
                                        props={props}
                                        id={dashboard.dashboardId}
                                        profileId={profile.profileId}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="h-10 w-full" role="presentation"></div>
                    {props.elements.length === 0 &&
                        (dashboard.ownerId === profile.profileId || ["admin", "editor"].includes(role ?? "")) && (
                            <div className="absolute top-3 right-3 z-10 flex flex-col items-center justify-center space-y-3 rounded-lg bg-neutral-100 px-4 py-4 shadow">
                                <LuMoveUpRight className="size-9 text-neutral-400" />
                                <span className="font-bold text-neutral-500">{t("addWidget")}</span>
                            </div>
                        )}
                </ScrollArea>
            </div>
        </div>
    );
}
