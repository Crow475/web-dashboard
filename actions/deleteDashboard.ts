"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import shortToUuid from "@/lib/shortToUuid";

import { dataDB } from "@/db/drizzle";
import { dashboards } from "@/db/data/schema";
import { eq } from "drizzle-orm";

import getProfileOfUser from "./getProfileOfUser";
import getDashboard from "./getDashboard";

export async function deleteDashboard(dashboardShortId: string) {
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

    if (dashboard.ownerId !== profile.profileId) {
        return null;
    }

    const result = await dataDB
        .delete(dashboards)
        .where(eq(dashboards.dashboardId, shortToUuid(dashboardShortId)))
        .returning({ deletedId: dashboards.dashboardId, deletedTitle: dashboards.title });

    return result[0];
}
