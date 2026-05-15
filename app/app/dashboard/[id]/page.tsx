import { notFound, forbidden } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";

import { LuPencil } from "react-icons/lu";

import getDashboard from "@/actions/getDashboard";
import getProfileOfUser from "@/actions/getProfileOfUser";

import { notoColorEmoji } from "@/lib/fonts";

import { getTranslations } from "next-intl/server";

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
            <div className="grid grid-cols-2"></div>
        </div>
    );
}
