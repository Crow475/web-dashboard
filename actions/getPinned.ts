"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { dashboards, profiles, usersOfDashboard } from "@/db/data/schema";
import { inArray, eq, or, and } from "drizzle-orm";

import type { profilePreferences } from "@/lib/types";

import getProfileOfUser from "./getProfileOfUser";

export default async function getPinned() {
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

    const { pinned } = profile.preferences as profilePreferences;

    console.log("Pinned:", pinned);

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
        .where(and(inArray(dashboards.dashboardId, pinned ?? []), memberOrOwner(profile.profileId)));

    const filterNonAccessible = pinned.filter(
        (dashboardId) => !result.find((dashboard) => dashboard.dashboardId === dashboardId),
    );

    if (filterNonAccessible.length > 0) {
        const filterResult = await dataDB
            .update(profiles)
            .set({
                preferences: {
                    pinned: pinned.filter((dashboardId) => !filterNonAccessible.includes(dashboardId)),
                },
            })
            .where(eq(profiles.profileId, profile.profileId));
    }

    // console.log("Filter Non Existent:", filterNonAccessible);

    return result;
}
