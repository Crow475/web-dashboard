"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import type { dashboardUserSelectReturn } from "@/lib/types";

import uuidToShort from "@/lib/uuidToShort";

import { dataDB } from "@/db/drizzle";
import { usersOfDashboard } from "@/db/data/schema";

type returnType = {
    success: boolean;
    errors?: {
        auth?: string[];
        db?: string[];
    };
};

import getProfileOfUser from "@/actions/getProfileOfUser";
import getDashboard from "@/actions/getDashboard";
import { eq } from "drizzle-orm";

export default async function updateDashboardUsers(
    dashboardId: string,
    users: dashboardUserSelectReturn,
): Promise<returnType> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            success: false,
            errors: {
                auth: ["INVALID_SESSION"],
            },
        };
    }

    const profile = await getProfileOfUser(session.user.id);
    if (!profile) {
        return {
            success: false,
            errors: {
                auth: ["INVALID_PROFILE"],
            },
        };
    }

    const dashboard = await getDashboard(uuidToShort(dashboardId), profile.profileId);

    if (!dashboard) {
        return {
            success: false,
            errors: {
                auth: ["INVALID_DASHBOARD"],
            },
        };
    }

    // Replace with better check for access
    if (dashboard.ownerId !== profile.profileId) {
        return {
            success: false,
            errors: {
                auth: ["NO_ACCESS"],
            },
        };
    }

    const resultDelete = await dataDB
        .delete(usersOfDashboard)
        .where(eq(usersOfDashboard.dashboardId, dashboardId))
        .returning({ updatedId: usersOfDashboard.dashboardId });

    if (users.length === 0) {
        return {
            success: true,
        };
    }

    const values = users.map((user) => ({
        dashboardId: dashboardId,
        profileId: user.profile?.profileId ?? "",
        roleInDashboard: user.role,
    }));

    const result = await dataDB
        .insert(usersOfDashboard)
        .values(values)
        .returning({ updatedId: usersOfDashboard.dashboardId });

    if (result.length === 0) {
        return {
            success: false,
            errors: {
                db: ["DB_ERROR"],
            },
        };
    }

    return {
        success: true,
    };
}
