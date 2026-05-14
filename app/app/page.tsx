import { forbidden } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { LuLayoutGrid, LuCircleOff, LuCirclePlus } from "react-icons/lu";

import { auth } from "@/lib/auth";
import uuidToShort from "@/lib/uuidToShort";

import getProfileOfUser from "@/actions/getProfileOfUser";
import getOwnedDashboards from "@/actions/getOwnedDashboards";

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

    const profileIdShort = uuidToShort(profile?.profileId || "");

    const dashboards = await getOwnedDashboards(profileIdShort, userId);

    return (
        <main className="flex max-h-screen w-full flex-col items-center justify-start overflow-hidden">
            <DefaultHeader title={t("title")} icon={<LuLayoutGrid size={32} />} />
            <ScrollArea className="flex h-[90vh] w-[90%] flex-col items-center justify-start px-2">
                {/* <div className="sticky top-0 flex h-10 w-full flex-row bg-neutral-200"></div> */}
                <div className="grid w-full grid-cols-2 gap-4 px-2 py-4">
                    {dashboards.map((dashboard) => (
                        <DashboardListItem
                            key={dashboard.dashboardId}
                            title={dashboard.title}
                            editedAt={dashboard.editedAt}
                            username={dashboard.owner.username}
                            id={dashboard.dashboardId}
                            createdAt={dashboard.createdAt}
                            icon={dashboard.icon ?? "🚫"}
                        />
                    ))}
                    {dashboards.length > 0 && (
                        <Link
                            className="col-span-2 row-span-1 flex w-full flex-row items-center justify-center space-x-4 rounded-lg border border-neutral-300 px-4 py-4 text-neutral-600 shadow hover:bg-neutral-100 hover:text-black"
                            href="/app/dashboard/create"
                        >
                            <LuCirclePlus size={30} />
                            <span className="text-lg font-semibold">{t("createNew")}</span>
                        </Link>
                    )}
                    <div className="col-span-2 hidden h-[80svh] w-full flex-col items-center justify-around rounded-xl bg-neutral-50 px-10 py-10 only:flex">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <LuCircleOff className="size-20 text-neutral-400" />
                            <h2 className="text-3xl font-semibold text-neutral-600">{t("noDashboardsTitle")}</h2>
                        </div>
                        <p className="text-lg text-neutral-600">{t("noDashboardsSubtitle")}</p>
                        <Link
                            className="flex w-1/3 cursor-pointer flex-row items-center justify-center space-x-3 rounded-md border border-blue-400 bg-blue-500 py-4 shadow hover:bg-blue-600"
                            href="/app/dashboard/create"
                        >
                            <LuCirclePlus size={30} className="text-white" />
                            <span className="text-lg font-semibold text-white">{t("createDashboard")}</span>
                        </Link>
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
}
