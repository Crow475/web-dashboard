"use server";

import { eq } from "drizzle-orm";

import { dataDB } from "@/db/drizzle";
import { profiles, dashboards } from "@/db/data/schema";

import type { dashboardUserSelectReturn } from "@/lib/types";

export default async function getOwnerOfDashboard(dashboardId: string) {
    const result = await dataDB
        .select({
            profile: profiles,
            dashboardId: dashboards.dashboardId,
        })
        .from(dashboards)
        .leftJoin(profiles, eq(dashboards.ownerId, profiles.profileId))
        .where(eq(dashboards.dashboardId, dashboardId))
        .execute();

    if (result.length === 0) {
        return null;
    }

    return <dashboardUserSelectReturn[0]>{
        profile: result[0].profile,
        dashboardId: result[0].dashboardId,
        role: null,
    };
}
