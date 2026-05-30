"use server";

import { eq, and } from "drizzle-orm";

import { dataDB } from "@/db/drizzle";
import { dashboards, profiles } from "@/db/data/schema";

import shortToUuid from "@/lib/shortToUuid";

import getProfileById from "@/actions/getProfileById";

export default async function getOwnedDashboards(profileShortId: string, requestUserId: string) {
    const profileId = shortToUuid(profileShortId);

    const requestedProfile = await getProfileById(profileShortId);

    const sameUser = requestedProfile?.userId === requestUserId;

    console.log("Same user:", sameUser);

    if (!sameUser) {
        const boards = dataDB
            .select({
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
            .innerJoin(profiles, eq(profiles.profileId, dashboards.ownerId))
            .where(and(eq(dashboards.ownerId, profileId), eq(dashboards.isPrivate, false)));

        return boards;
    }

    const boards = dataDB
        .select({
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
        .innerJoin(profiles, eq(profiles.profileId, dashboards.ownerId))
        .where(eq(dashboards.ownerId, profileId));

    return boards;
}
