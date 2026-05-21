"use server";

import { headers } from "next/headers";

import type { dashboardProps } from "@/lib/types";

import { auth } from "@/lib/auth";
import uuidToShort from "@/lib/uuidToShort";
import { dataDB } from "@/db/drizzle";
import { dashboards } from "@/db/data/schema";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import getProfileOfUser from "@/actions/getProfileOfUser";
import getDashboard from "@/actions/getDashboard";
import getRoleInDashboard from "./getRoleInDashboard";

export type dashboardData = {
    title: string;
    icon: string;
    private: boolean;
    props: dashboardProps;
};

type returnType = {
    success: boolean;
    errors?: {
        auth?: string[];
        db?: string[];
        title?: string[];
        icon?: string[];
        private?: string[];
    };
};

export async function updateDashboard(dashboardId: string, data: dashboardData): Promise<returnType> {
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

    const shortId = uuidToShort(dashboardId);
    const dashboard = await getDashboard(shortId, profile.profileId);

    if (!dashboard) {
        return {
            success: false,
            errors: {
                auth: ["INVALID_DASHBOARD"],
            },
        };
    }

    const changed = {
        title: data.title !== dashboard.title,
        icon: data.icon.trim() !== dashboard.icon?.trim(),
        private: data.private !== dashboard.isPrivate,
    };

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

        if (role === "viewer") {
            return {
                success: false,
                errors: {
                    auth: ["NO_ACCESS"],
                },
            };
        }
    }

    if (changed.private && !isOwner) {
        return {
            success: false,
            errors: {
                auth: ["NO_ACCESS"],
            },
        };
    }

    if ((changed.title || changed.icon) && !isOwner && role !== "admin") {
        return {
            success: false,
            errors: {
                auth: ["NO_ACCESS"],
            },
        };
    }

    const updateDashboardSchema = z.object({
        title: z.string("INVALID_TITLE").min(4, "TITLE_TOO_SHORT").max(63, "TITLE_TOO_LONG").trim(),
        icon: z.emoji("INVALID_ICON").optional(),
        private: z.boolean("INVALID_PRIVATE"),
    });

    const validatedData = updateDashboardSchema.safeParse({
        title: data.title,
        icon: data.icon,
        private: data.private,
    });

    if (!validatedData.success) {
        return {
            success: false,
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    const result = await dataDB
        .update(dashboards)
        .set({
            title: data.title,
            icon: data.icon,
            isPrivate: data.private,
            editedAt: sql`NOW()`,
            properties: JSON.stringify(data.props),
        })
        .where(eq(dashboards.dashboardId, dashboardId))
        .returning({ updatedId: dashboards.dashboardId });

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
