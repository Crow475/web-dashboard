"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { dashboards, profiles, usersOfDashboard } from "@/db/data/schema";
import { eq, and, or } from "drizzle-orm";

import type { profilePreferences } from "@/lib/types";

import getProfileOfUser from "./getProfileOfUser";

export default async function getLastOpened() {
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
        return null;
    }

    const memberOrOwner = (profileId: string) =>
        or(
            eq(dashboards.ownerId, profileId),
            and(eq(usersOfDashboard.dashboardId, dashboards.dashboardId), eq(usersOfDashboard.profileId, profileId)),
        );

    const result = await dataDB
        .selectDistinctOn([dashboards.dashboardId], {
            dashboardId: dashboards.dashboardId,
            title: dashboards.title,
            createdAt: dashboards.createdAt,
            editedAt: dashboards.editedAt,
            properties: dashboards.properties,
            ownerId: dashboards.ownerId,
            icon: dashboards.icon,
            owner: profiles,
        })
        .from(dashboards)
        .leftJoin(profiles, eq(profiles.profileId, dashboards.ownerId))
        .leftJoin(usersOfDashboard, eq(usersOfDashboard.dashboardId, dashboards.dashboardId))
        .where(and(eq(dashboards.dashboardId, preferences.lastOpened), memberOrOwner(profile.profileId)));

    const deleteNonAccessible = (lastOpened: string) =>
        !result.find((dashboard) => dashboard.dashboardId === lastOpened);

    if (deleteNonAccessible(preferences.lastOpened)) {
        const filterResult = await dataDB
            .update(profiles)
            .set({
                preferences: {
                    lastOpened: null,
                },
            })
            .where(eq(profiles.profileId, profile.profileId));
    }

    return result[0];
}
