import { notFound } from "next/navigation";

import getProfileById from "@/actions/getProfileById";

import { LuUserPen } from "react-icons/lu";

import DefaultHeader from "@/components/custom/defaultHeader";

export default async function ProfileEditPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const profile = await getProfileById(id);

    if (!profile) {
        notFound();
    }

    return (
        <main className="flex w-full flex-col items-center justify-start">
            <DefaultHeader title="Edit Profile" icon={<LuUserPen size={32} />} />
            <div className="flex w-[90%] flex-col items-center justify-start"></div>
        </main>
    );
}
