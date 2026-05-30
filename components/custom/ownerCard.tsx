"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import getProfileById from "@/actions/getProfileById";
import type { profileSelectReturn } from "@/lib/types";
import uuidToShort from "@/lib/uuidToShort";

import { notoColorEmoji } from "@/lib/fonts";

export default function OwnerCard({ profileId }: { profileId: string }) {
    const [profile, setProfile] = useState<profileSelectReturn>();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        getProfileById(profileId).then((profile) => {
            setProfile(profile as profileSelectReturn);
        });
    }, [profileId]);

    const currentUser = session?.user.id;
    const isOwner = profile?.userId === currentUser;

    return (
        <div
            className={`flex w-full flex-row items-center justify-between rounded-md border border-neutral-200 px-3 py-2 shadow ${isOwner ? "bg-neutral-100" : "bg-white"}`}
        >
            <div className="flex flex-row items-center justify-start space-x-2">
                <div className={`${notoColorEmoji.className} text-xl`}>{profile?.icon}</div>
                {isOwner ? (
                    <span className="line-clamp-1 text-base font-semibold md:text-lg">{profile?.username}</span>
                ) : (
                    <Link
                        className="line-clamp-1 text-base font-semibold hover:underline md:text-lg"
                        href={`/app/profile/${uuidToShort(profile?.profileId ?? "")}`}
                    >
                        {profile?.username}
                    </Link>
                )}
            </div>
            <span className="text-xs text-neutral-500">Owner</span>
        </div>
    );
}
