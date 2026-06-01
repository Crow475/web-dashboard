import Link from "next/link";
import { notFound, forbidden } from "next/navigation";
import { headers } from "next/headers";

import getProfileById from "@/actions/getProfileById";
import getProfileOfUser from "@/actions/getProfileOfUser";
import getOwnedDashboards from "@/actions/getOwnedDashboards";
import getCommonDashboards from "@/actions/getCommonDashboards";

import shortToUuid from "@/lib/shortToUuid";

import { auth } from "@/lib/auth";

import { getTranslations } from "next-intl/server";

import { LuMail, LuPencil } from "react-icons/lu";

import { ScrollArea } from "@/components/ui/scroll-area";

import { notoColorEmoji } from "@/lib/fonts";
import CopyUserId from "@/components/custom/copyUserId";
import DashboardListItem from "@/components/custom/dashboardListItem";
import ProfileEditLink from "@/components/custom/profileEditLink";

function EmailLink({ email }: { email: string | null }) {
    if (!email) {
        return null;
    }
    return (
        <div className="flex flex-row items-center justify-start space-x-2 text-sm text-neutral-500 md:text-base">
            <LuMail className="size-4 md:size-5" />
            <a href={`mailto:${email}`} className="underline">
                {email}
            </a>
        </div>
    );
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const profile = await getProfileById(id);

    const t = await getTranslations("profile");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!profile) {
        notFound();
    }

    if (!session) {
        forbidden();
    }

    const viewingProfile = await getProfileOfUser(session.user.id);

    if (!viewingProfile) {
        forbidden();
    }

    const isCurrentUser = session.user.id === profile.userId;

    const dashboards = isCurrentUser
        ? await getOwnedDashboards(id, session.user.id)
        : ((await getCommonDashboards(shortToUuid(id))) ?? []);

    console.log("Dashboards:", dashboards);

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center px-0 py-2 md:px-4">
            <div className="absolute flex h-[90svh] w-[90%] flex-col items-center justify-between rounded-2xl border border-neutral-300 bg-white p-3 shadow md:w-[60%] md:p-6">
                <div className="flex w-full flex-col justify-start">
                    <div className="flex w-full flex-row justify-start px-3 pt-2">
                        <div
                            className={`flex flex-row items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 px-2 py-1.5 text-2xl shadow select-none md:py-2.5 md:text-4xl ${notoColorEmoji.className}`}
                            role="img"
                            aria-label="Profile Picture"
                        >
                            {profile.icon}
                        </div>
                    </div>
                    <header className="flex w-full flex-col items-start justify-between space-y-2 border-b border-neutral-300 py-4 pl-4 md:flex-row md:items-center md:space-y-0">
                        <h1>
                            <span className="text-2xl font-bold md:text-4xl">{profile.username}</span>
                        </h1>
                        <CopyUserId userId={id} />
                    </header>
                    <div className="flex w-full flex-col items-start justify-start space-y-4 px-4 py-4 md:px-6">
                        <EmailLink email={profile.publicEmail} />
                    </div>
                    <div className="mt-4 flex w-full flex-col items-center justify-start px-4">
                        <div className="flex w-full flex-row items-center justify-start">
                            <h2 className="text-lg font-semibold md:text-2xl">
                                {isCurrentUser ? t("yourDashboards") : t("commonDashboards")}
                            </h2>
                        </div>
                        <ScrollArea className="flex h-[45vh] w-full flex-col items-center justify-start overflow-hidden px-0 md:px-2">
                            <div className="absolute bottom-0 left-0 z-10 h-5 w-full bg-linear-to-t from-white to-transparent"></div>
                            <div className="absolute top-0 left-0 z-10 h-5 w-full bg-linear-to-b from-white to-transparent"></div>
                            <div className="grid w-full grid-cols-1 gap-3 px-2 py-4 md:gap-4">
                                {dashboards.map((dashboard) => (
                                    <DashboardListItem
                                        key={dashboard.dashboardId}
                                        title={dashboard.title}
                                        editedAt={dashboard.editedAt}
                                        username={dashboard.owner.username}
                                        id={dashboard.dashboardId}
                                        createdAt={dashboard.createdAt}
                                        icon={dashboard.icon ?? "🚫"}
                                        isOwner={isCurrentUser ? true : dashboard.ownerId === viewingProfile.profileId}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="flex w-full flex-row items-center justify-end">
                    {isCurrentUser && <ProfileEditLink id={id} label={t("edit")} />}
                </div>
            </div>
        </main>
    );
}
