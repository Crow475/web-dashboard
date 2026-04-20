import Link from "next/link";
import { notFound } from "next/navigation";

import getProfileById from "@/actions/getProfileById";

import { LuMail, LuPencil } from "react-icons/lu";

import { notoColorEmoji } from "@/lib/fonts";
import CopyUserId from "@/components/custom/copyUserId";

function EmailLink({ email }: { email: string | null }) {
    if (!email) {
        return null;
    }
    return (
        <div className="flex flex-row items-center justify-start space-x-2 text-neutral-500">
            <LuMail size={20} />
            <a href={`mailto:${email}`} className="underline">
                {email}
            </a>
        </div>
    );
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const profile = await getProfileById(id);

    if (!profile) {
        notFound();
    }

    return (
        <main className="flex h-screen w-full flex-col items-center justify-center px-4 py-2">
            <div className="absolute flex h-[90vh] w-[60%] flex-col items-center justify-between rounded-2xl border border-neutral-300 bg-white p-6 shadow">
                <div className="flex w-full flex-col justify-start">
                    <div className="flex w-full flex-row justify-start px-3 pt-2">
                        <div
                            className={`flex flex-row items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 px-2 py-2.5 text-4xl shadow select-none ${notoColorEmoji.className}`}
                            role="img"
                            aria-label="Profile Picture"
                        >
                            {profile.icon}
                        </div>
                    </div>
                    <header className="flex w-full flex-row items-center justify-between border-b border-neutral-300 py-4 pl-4">
                        <h1>
                            <span className="text-4xl font-bold">{profile.username}</span>
                        </h1>
                        <CopyUserId userId={id} />
                    </header>
                    <div className="flex w-full flex-col items-start justify-start space-y-4 px-6 py-4">
                        <EmailLink email={profile.publicEmail} />
                    </div>
                </div>
                <div className="flex w-full flex-row items-center justify-end">
                    <Link
                        className="flex flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-4 py-2 text-neutral-500 shadow hover:border-amber-300 hover:bg-amber-200 hover:text-amber-500 hover:shadow-amber-200"
                        href={`/app/profile/${id}/edit`}
                    >
                        <LuPencil />
                        <span>Edit</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
