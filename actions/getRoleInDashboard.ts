"use server";

import { dataDB } from "@/db/drizzle";
import { usersOfDashboard } from "@/db/data/schema";
import { eq, and } from "drizzle-orm";

export default async function getRoleInDashboard(dashboardId: string, profileId: string) {
    const role = await dataDB
        .select({
            role: usersOfDashboard.roleInDashboard,
        })
        .from(usersOfDashboard)
        .where(and(eq(usersOfDashboard.dashboardId, dashboardId), eq(usersOfDashboard.profileId, profileId)));

    if (role.length === 0) {
        return null;
    }

    return role[0].role;
}
