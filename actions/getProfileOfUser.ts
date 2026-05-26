"use server";

import { eq } from "drizzle-orm";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";

export default async function getProfileOfUser(userId: string) {
    const profile = await dataDB
        .select({
            profileId: profiles.profileId,
            username: profiles.username,
            icon: profiles.icon,
            publicEmail: profiles.publicEmail,
            userId: profiles.userId,
            preferences: profiles.preferences,
        })
        .from(profiles)
        .where(eq(profiles.userId, userId));

    if (profile.length === 0) {
        return null;
    }

    return profile[0];
}

export type Profile = Awaited<ReturnType<typeof getProfileOfUser>>;
