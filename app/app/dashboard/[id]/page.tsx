import React from "react";

import { notFound, forbidden } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";

import { LuPencil } from "react-icons/lu";

import type { dashboardProps } from "@/lib/types";

import getDashboard from "@/actions/getDashboard";
import getProfileOfUser from "@/actions/getProfileOfUser";

import { notoColorEmoji } from "@/lib/fonts";
import { themeRegistry } from "@/lib/themeRegistry";

import { getTranslations } from "next-intl/server";

import { ScrollArea } from "@/components/ui/scroll-area";

import WidgetRegular from "@/components/custom/widgetRegular";

function ElementAtPosition({ row, col, props }: { row: number; col: number; props: dashboardProps }) {
    const element = props.elements.find((element) => element.position.row === row && element.position.col === col);

    if (!element) {
        return null;
    }

    return <WidgetRegular widget={element} />;
}

export default async function DashboardPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const t = await getTranslations("dashboard");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        forbidden();
    }

    const profile = await getProfileOfUser(session.user.id);

    if (!profile) {
        forbidden();
    }

    const dashboard = await getDashboard(id, profile.profileId);

    if (!dashboard) {
        notFound();
    }

    const props = dashboard.properties as dashboardProps;

    const mockRows = Array.from({ length: props.rows }, (_, i) => i + 1);

    return (
        <div className="flex h-svh w-full flex-col items-center justify-start">
            <header className="flex w-[98%] flex-row items-center justify-between border-b border-neutral-300 px-4 py-4">
                <div className="flex flex-row items-center justify-start space-x-2">
                    <div className={`${notoColorEmoji.className} flex flex-row items-center justify-center text-4xl`}>
                        {dashboard.icon}
                    </div>
                    <h1 className="border border-transparent px-2 py-1 text-4xl font-bold">{dashboard.title}</h1>
                </div>
                <div className="flex flex-row items-center justify-end">
                    <Link
                        className="flex flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-4 py-2 text-neutral-500 shadow hover:border-amber-300 hover:bg-amber-200 hover:text-amber-500 hover:shadow-amber-200"
                        href={`/app/dashboard/${id}/edit`}
                    >
                        <LuPencil className="size-3" />
                        <span className="text-xs md:text-sm">{t("edit")}</span>
                    </Link>
                </div>
            </header>
            <div className="flex w-full flex-row items-center justify-center pr-4">
                <ScrollArea
                    className={`flex h-[88vh] w-full flex-col items-center justify-start bg-fixed px-4 ${themeRegistry[props.preferences.theme].className}`}
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
                    <div className="grid w-full grid-cols-2 gap-2">
                        {mockRows.map((row) => (
                            <React.Fragment key={row}>
                                <div
                                    id={`${row}-1`}
                                    className="flex h-[50vh] w-full rounded-xl border border-neutral-100 empty:border-transparent"
                                >
                                    <ElementAtPosition row={row} col={1} props={props} />
                                </div>
                                <div
                                    id={`${row}-2`}
                                    className="flex h-[50vh] w-full rounded-xl border border-neutral-100 empty:border-transparent"
                                >
                                    <ElementAtPosition row={row} col={2} props={props} />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="h-10 w-full" role="presentation"></div>
                </ScrollArea>
            </div>
        </div>
    );
}
