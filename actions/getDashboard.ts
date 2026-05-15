import { dataDB } from "@/db/drizzle";
import { dashboards } from "@/db/data/schema";

import { eq } from "drizzle-orm";

import shortToUuid from "@/lib/shortToUuid";

export default async function getDashboard(shortId: string, requesterProfileId: string) {
    const dashboardId = shortToUuid(shortId);

    const result = await dataDB
        .select({
            dashboardId: dashboards.dashboardId,
            title: dashboards.title,
            isPrivate: dashboards.isPrivate,
            icon: dashboards.icon,
            ownerId: dashboards.ownerId,
            properties: dashboards.properties,
            createdAt: dashboards.createdAt,
            editedAt: dashboards.editedAt,
        })
        .from(dashboards)
        .where(eq(dashboards.dashboardId, dashboardId));

    if (result.length === 0) {
        return null;
    }

    // Replace with better check for access
    if (requesterProfileId !== result[0].ownerId) {
        return null;
    }

    return result[0];
}
