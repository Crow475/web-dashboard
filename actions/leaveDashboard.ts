"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { usersOfDashboard } from "@/db/data/schema";
import { eq, and } from "drizzle-orm";

import getProfileOfUser from "./getProfileOfUser";

export default async function leaveDashboard(dashboardId: string) {
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

    const result = await dataDB
        .delete(usersOfDashboard)
        .where(and(eq(usersOfDashboard.dashboardId, dashboardId), eq(usersOfDashboard.profileId, profile.profileId)))
        .returning({ updatedId: usersOfDashboard.dashboardId });

    return result[0];
}
