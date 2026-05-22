"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { dashboards, usersOfDashboard, profiles } from "@/db/data/schema";
import { eq, or, and } from "drizzle-orm";

import getUserProfile from "@/actions/getProfileOfUser";

export default async function getCommonDashboards(profileId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const profile = await getUserProfile(session.user.id);

    if (!profile) {
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
            isPrivate: dashboards.isPrivate,
            icon: dashboards.icon,
            ownerId: dashboards.ownerId,
            properties: dashboards.properties,
            createdAt: dashboards.createdAt,
            editedAt: dashboards.editedAt,
            owner: profiles,
        })
        .from(dashboards)
        .leftJoin(usersOfDashboard, eq(usersOfDashboard.dashboardId, dashboards.dashboardId))
        .innerJoin(profiles, eq(profiles.profileId, dashboards.ownerId))
        .where(and(and(memberOrOwner(profileId), memberOrOwner(profile.profileId)), eq(dashboards.isPrivate, false)));

    return result;
}
