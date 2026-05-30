"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { dashboards, usersOfDashboard, profiles } from "@/db/data/schema";
import { eq, or, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

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

    const uod1 = alias(usersOfDashboard, "uod1");
    const uod2 = alias(usersOfDashboard, "uod2");

    const memberOrOwner = (table: typeof uod1 | typeof uod2, pid: string) =>
        or(eq(dashboards.ownerId, pid), and(eq(table.dashboardId, dashboards.dashboardId), eq(table.profileId, pid)));

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
        .leftJoin(uod1, eq(uod1.dashboardId, dashboards.dashboardId))
        .leftJoin(uod2, eq(uod2.dashboardId, dashboards.dashboardId))
        .innerJoin(profiles, eq(profiles.profileId, dashboards.ownerId))
        // .where(and(and(memberOrOwner(profileId), memberOrOwner(profile.profileId)), eq(dashboards.isPrivate, false)));
        .where(and(memberOrOwner(uod1, profileId), memberOrOwner(uod2, profile.profileId)));

    return result;
}
