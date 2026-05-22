import { forbidden } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { LuLayoutGrid, LuCircleOff, LuCirclePlus } from "react-icons/lu";

import { auth } from "@/lib/auth";

import getProfileOfUser from "@/actions/getProfileOfUser";
import getAllUserDashboards from "@/actions/getAllUserDashboards";

import { ScrollArea } from "@/components/ui/scroll-area";

import DashboardListItem from "@/components/custom/dashboardListItem";
import DefaultHeader from "@/components/custom/defaultHeader";

export default async function Home() {
    const t = await getTranslations("home");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        forbidden();
    }

    const userId = session.user.id;
    const profile = await getProfileOfUser(userId);

    const dashboards = await getAllUserDashboards();
    if (!dashboards) {
        forbidden();
    }

    console.log("Dashboards:", dashboards);

    return (
        <main className="flex max-h-screen w-full flex-col items-center justify-start overflow-hidden">
            <DefaultHeader title={t("title")} icon={<LuLayoutGrid size={32} />} />
            <ScrollArea className="flex h-[90vh] w-[90%] flex-col items-center justify-start px-2">
                {/* <div className="sticky top-0 flex h-10 w-full flex-row bg-neutral-200"></div> */}
                <div className="absolute bottom-0 left-0 z-10 h-5 w-full bg-linear-to-t from-white to-transparent"></div>
                <div className="grid w-full grid-cols-2 gap-3 px-2 py-4 md:gap-4">
                    {dashboards.map((dashboard) => (
                        <DashboardListItem
                            key={dashboard.dashboardId}
                            title={dashboard.title}
                            editedAt={dashboard.editedAt}
                            username={dashboard.owner.username}
                            id={dashboard.dashboardId}
                            createdAt={dashboard.createdAt}
                            icon={dashboard.icon ?? "🚫"}
                            isOwner={dashboard.ownerId === profile?.profileId}
                        />
                    ))}
                    {dashboards.length > 0 && (
                        <Link
                            className="col-span-2 row-span-1 flex w-full flex-row items-center justify-center space-x-2 rounded-2xl border border-neutral-300 px-4 py-4 text-neutral-600 shadow hover:bg-neutral-100 hover:text-black md:space-x-4"
                            href="/app/dashboard/create"
                        >
                            <LuCirclePlus className="size-5 md:size-8" />
                            <span className="text-base font-semibold md:text-lg">{t("createNew")}</span>
                        </Link>
                    )}
                    <div className="col-span-2 hidden h-[80svh] w-full flex-col items-center justify-between rounded-xl bg-neutral-50 px-5 py-6 only:flex md:px-10 md:py-10">
                        <div className="flex h-3/4 flex-col items-center justify-center space-y-10">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <LuCircleOff className="size-15 text-neutral-400 md:size-20" />
                                <h2 className="text-center text-xl font-semibold whitespace-pre text-neutral-600 md:text-3xl">
                                    {t("noDashboardsTitle")}
                                </h2>
                            </div>
                            <p className="text-sm text-neutral-400 md:text-lg">{t("noDashboardsSubtitle")}</p>
                        </div>
                        <Link
                            className="flex w-full cursor-pointer flex-row items-center justify-center space-x-2 rounded-md border border-blue-400 bg-blue-500 py-4 shadow hover:bg-blue-600 md:w-1/3 md:space-x-3"
                            href="/app/dashboard/create"
                        >
                            <LuCirclePlus className="size-5 text-white md:size-8" />
                            <span className="text-sm font-semibold text-white md:text-lg">{t("createDashboard")}</span>
                        </Link>
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
}
