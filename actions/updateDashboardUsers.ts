"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import type { dashboardUserSelectReturn } from "@/lib/types";

import uuidToShort from "@/lib/uuidToShort";

import { dataDB } from "@/db/drizzle";
import { usersOfDashboard } from "@/db/data/schema";

import getRoleInDashboard from "./getRoleInDashboard";

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

    const role = await getRoleInDashboard(dashboardId, profile.profileId);
    const isOwner = dashboard.ownerId === profile.profileId;

    if (!isOwner) {
        if (!role) {
            return {
                success: false,
                errors: {
                    auth: ["NO_ACCESS"],
                },
            };
        }

        if (role !== "admin") {
            return {
                success: false,
                errors: {
                    auth: ["NO_ACCESS"],
                },
            };
        }
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
