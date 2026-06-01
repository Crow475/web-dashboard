"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";
import { eq } from "drizzle-orm";

import type { profilePreferences } from "@/lib/types";

import getProfileOfUser from "./getProfileOfUser";

export default async function setLastOpened(dashboardId: string) {
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

    if (!preferences.lastOpened) {
        preferences.lastOpened = dashboardId;
    }

    const result = await dataDB
        .update(profiles)
        .set({
            preferences: {
                lastOpened: dashboardId,
                pinned: preferences.pinned,
            },
        })
        .where(eq(profiles.profileId, profile.profileId))
        .returning({ updatedPreferences: profiles.preferences });

    if (result.length === 0) {
        return null;
    }

    return result[0];
}
