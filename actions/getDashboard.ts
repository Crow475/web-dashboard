import { dataDB } from "@/db/drizzle";
import { dashboards } from "@/db/data/schema";

import { eq } from "drizzle-orm";

import shortToUuid from "@/lib/shortToUuid";

import getRoleInDashboard from "./getRoleInDashboard";

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

    const isOwner = requesterProfileId === result[0].ownerId;
    const role = await getRoleInDashboard(result[0].dashboardId, requesterProfileId);

    if (!isOwner) {
        if (!role) {
            return null;
        }

        if (role === "admin") {
            return result[0];
        }
        if (role === "editor") {
            return result[0];
        }
        if (role === "viewer") {
            return result[0];
        }
    }

    return result[0];
}
