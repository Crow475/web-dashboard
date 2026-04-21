"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { profiles } from "@/db/schema";

import shortToUuid from "@/lib/shortToUuid";

export default async function getProfileById(profileId: string) {
    const uuidProfileId = shortToUuid(profileId);
    const profile = await db
        .select({
            profileId: profiles.profileId,
            username: profiles.username,
            icon: profiles.icon,
            publicEmail: profiles.publicEmail,
        })
        .from(profiles)
        .where(eq(profiles.profileId, uuidProfileId));

    if (profile.length === 0) {
        return null;
    }

    return profile[0];
}
