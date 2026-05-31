import Link from "next/link";

import type { profileSelectReturn } from "@/lib/types";

import uuidToShort from "@/lib/uuidToShort";

import { LuChevronRight } from "react-icons/lu";

import { notoColorEmoji } from "@/lib/fonts";

export default function UserSearchCard({ user }: { user: profileSelectReturn }) {
    const shortId = uuidToShort(user.profileId);

    return (
        <Link
            className="flex w-full flex-row items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow hover:bg-neutral-50"
            href={`/app/profile/${shortId}`}
        >
            <div className="flex flex-row items-center justify-start space-x-4">
                <span
                    className={`${notoColorEmoji.className} text-3xl select-none`}
                    role="img"
                    aria-label="Profile Picture"
                >
                    {user.icon}
                </span>
                <div className="flex flex-col items-start justify-start">
                    <span className="text-xl font-semibold">{user.username}</span>
                    <span className="h-5 text-sm text-neutral-400">{user.publicEmail}</span>
                </div>
            </div>
            <LuChevronRight className="size-7 text-neutral-400" />
        </Link>
    );
}
