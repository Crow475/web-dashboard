"use server";

import { headers } from "next/headers";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { profiles, usersOfDashboard, dashboards } from "@/db/data/schema";

import getProfileOfUser from "./getProfileOfUser";
import getDashboard from "./getDashboard";

export default async function getUsersOfDashboard(dashboardShortId: string) {
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

    const dashboard = await getDashboard(dashboardShortId, profile.profileId);
    if (!dashboard) {
        return null;
    }

    if (dashboard.isPrivate) {
        return null;
    }

    const users = await dataDB
        .select({
            profile: profiles,
            dashboardId: dashboards.dashboardId,
            role: usersOfDashboard.roleInDashboard,
        })
        .from(usersOfDashboard)
        .leftJoin(profiles, eq(usersOfDashboard.profileId, profiles.profileId))
        .leftJoin(dashboards, eq(usersOfDashboard.dashboardId, dashboards.dashboardId))
        .where(eq(dashboards.dashboardId, dashboard.dashboardId))
        .execute();

    return users;
}
