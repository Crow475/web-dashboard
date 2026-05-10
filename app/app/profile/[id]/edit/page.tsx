import { notFound, forbidden } from "next/navigation";
import { headers } from "next/headers";

import getProfileById from "@/actions/getProfileById";
import { auth } from "@/lib/auth";

import { LuUserPen } from "react-icons/lu";

import DefaultHeader from "@/components/custom/defaultHeader";

export default async function ProfileEditPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const profile = await getProfileById(id);

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
            <DefaultHeader title="Edit Profile" icon={<LuUserPen size={32} />} />
            <div className="flex w-[90%] flex-col items-center justify-start"></div>
        </main>
    );
}
