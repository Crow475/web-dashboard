import { notFound, forbidden } from "next/navigation";
import { headers } from "next/headers";

import getProfileById from "@/actions/getProfileById";
import { auth } from "@/lib/auth";

import { LuUserPen } from "react-icons/lu";

import DefaultHeader from "@/components/custom/defaultHeader";
import ProfileEditor from "@/components/custom/profileEditor";

import { getTranslations } from "next-intl/server";

export default async function ProfileEditPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const profile = await getProfileById(id);

    const t = await getTranslations("editProfile");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!profile) {
        notFound();
    }

    if (!session || session.user.id !== profile.userId) {
        forbidden();
    }

    return (
        <main className="flex w-full flex-col items-center justify-start">
            <DefaultHeader title={t("title")} icon={<LuUserPen size={32} />} />
            <ProfileEditor profile={profile} />
        </main>
    );
}
