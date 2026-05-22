"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { dashboards, usersOfDashboard, profiles } from "@/db/data/schema";
import { eq, or } from "drizzle-orm";

import getUserProfile from "@/actions/getProfileOfUser";

export default async function getAllUserDashboards() {
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
        .where(or(eq(dashboards.ownerId, profile.profileId), eq(usersOfDashboard.profileId, profile.profileId)));

    return result;
}
