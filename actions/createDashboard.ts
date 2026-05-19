"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { dataDB } from "@/db/drizzle";
import { dashboards } from "@/db/data/schema";

import { themeTypes } from "@/lib/themeRegistry";
import type { actionState, dashboardProps } from "@/lib/types";
import uuidToShort from "@/lib/uuidToShort";
import getProfileOfUser from "@/actions/getProfileOfUser";

import { z } from "zod";
import { getTranslations } from "next-intl/server";

export type createDashboardActionState = actionState & {
    messages: {
        title?: string;
        isPrivate?: boolean;
        icon?: string;
    };
    errors?: {
        title?: string[];
        isPrivate?: string[];
        auth?: string[];
        icon?: string[];
    };
};

export async function createDashboard(
    _prevState: createDashboardActionState,
    formData: FormData,
): Promise<createDashboardActionState> {
    const t = await getTranslations("createDashboard");

    const createDashboardSchema = z.object({
        title: z.string(t("invalidTitle")).min(4, t("titleTooShort")).max(63, t("titleTooLong")).trim(),
        isPrivate: z.boolean(t("invalidPrivate")),
        profileId: z.string(t("invalidUserId")),
        icon: z.emoji(t("invalidIcon")).optional(),
    });

    const title = formData.get("title") as string;
    const isPrivate = (formData.get("isPrivate") as string) === "on";
    const icon = formData.get("icon") as string;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            messages: {
                title: title,
                isPrivate: isPrivate,
                icon: icon,
            },
            errors: {
                auth: [t("invalidSession")],
            },
        };
    }

    const userId = session.user.id;

    const profile = await getProfileOfUser(userId);
    if (!profile) {
        return {
            messages: {
                title: title,
                isPrivate: isPrivate,
                icon: icon,
            },
            errors: {
                auth: [t("invalidProfile")],
            },
        };
    }

    console.log("Received form data:", { title, isPrivate, icon, userId, profile });

    const validatedData = createDashboardSchema.safeParse({
        title,
        userId,
        isPrivate,
        profileId: profile.profileId,
        icon,
    });

    if (!validatedData.success) {
        console.log("Validation errors:", validatedData.error.flatten().fieldErrors);

        return {
            messages: {
                title: title,
                isPrivate: isPrivate,
                icon: icon,
            },
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    console.log("Creating dashboard:", validatedData.data);

    const props: dashboardProps = {
        rows: 4,
        elements: [],
        preferences: {
            theme: themeTypes.none,
        },
    };

    const result = await dataDB
        .insert(dashboards)
        .values({
            title: validatedData.data.title,
            isPrivate: validatedData.data.isPrivate,
            icon: validatedData.data.icon,
            ownerId: validatedData.data.profileId,
            properties: JSON.stringify(props),
        })
        .returning({
            createdId: dashboards.dashboardId,
        });

    const dashboardUUID = result[0].createdId;
    const dashboardShortId = uuidToShort(dashboardUUID);

    redirect(`/app/dashboard/${dashboardShortId}`);

    return {
        messages: {
            title: title,
            isPrivate: isPrivate,
            icon: icon,
        },
    };
}
