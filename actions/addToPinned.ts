"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";
import { eq } from "drizzle-orm";

import type { profilePreferences } from "@/lib/types";

import getProfileOfUser from "./getProfileOfUser";

export default async function addToPinned(dashboardId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const profile = await getProfileOfUser(session.user.id);

    if (!profile) {
        return null;
    }

    const preferences = profile.preferences as profilePreferences;

    if (!preferences.pinned) {
        preferences.pinned = [];
    }

    if (preferences.pinned.includes(dashboardId)) {
        return null;
    }

    const result = await dataDB
        .update(profiles)
        .set({
            preferences: {
                pinned: [...(preferences.pinned ?? []), dashboardId],
            },
        })
        .where(eq(profiles.profileId, profile.profileId))
        .returning({ updatedId: profiles.profileId });

    if (result.length === 0) {
        return null;
    }

    return result[0];
}
