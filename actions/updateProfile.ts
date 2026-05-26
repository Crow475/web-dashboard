"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { auth } from "@/lib/auth";

import { z } from "zod";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";
import { eq } from "drizzle-orm";

import { getTranslations } from "next-intl/server";

import type { actionState, profilePreferences } from "@/lib/types";
import uuidToShort from "@/lib/uuidToShort";

import getProfileOfUser from "./getProfileOfUser";

export type profileActionState = actionState & {
    messages: {
        username?: string;
        profileIcon?: string;
        publicEmail?: string | null;
    };
    errors?: {
        username?: string[];
        profileIcon?: string[];
        publicEmail?: string[];
        auth?: string[];
        db?: string[];
    };
};

export async function updateProfile(_prevState: profileActionState, formData: FormData): Promise<profileActionState> {
    const t = await getTranslations("editProfile.errors");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            messages: {
                username: formData.get("username") as string,
                profileIcon: formData.get("profileIcon") as string,
                publicEmail: formData.get("publicEmail") as string,
            },
            errors: {
                auth: [t("INVALID_SESSION")],
            },
        };
    }

    const profile = await getProfileOfUser(session.user.id);
    if (!profile) {
        return {
            messages: {
                username: formData.get("username") as string,
                profileIcon: formData.get("profileIcon") as string,
                publicEmail: formData.get("publicEmail") as string,
            },
            errors: {
                auth: [t("INVALID_PROFILE")],
            },
        };
    }

    const profileSchema = z.object({
        username: z
            .string(t("INVALID_USERNAME"))
            .min(4, t("USERNAME_TOO_SHORT"))
            .max(63, t("USERNAME_TOO_LONG"))
            .trim(),
        profileIcon: z.emoji(t("INVALID_PROFILE_ICON")),
        publicEmail: z.email(t("INVALID_EMAIL")).nullable(),
    });

    const username = formData.get("username") as string;
    const profileIcon = (formData.get("profileIcon") as string).trim();
    const publicEmail = formData.get("publicEmail") as string | null;

    console.log("Data:", username, profileIcon, publicEmail);

    const validatedData = profileSchema.safeParse({
        username,
        profileIcon,
        publicEmail,
    });

    if (!validatedData.success) {
        return {
            messages: {
                username: username,
                profileIcon: profileIcon,
                publicEmail: publicEmail ?? "",
            },
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    const preferences = profile.preferences as profilePreferences;

    const result = await dataDB
        .update(profiles)
        .set({
            username: validatedData.data.username,
            icon: validatedData.data.profileIcon,
            publicEmail: validatedData.data.publicEmail,
            preferences: preferences.pinned ? profile.preferences : { pinned: [] },
        })
        .where(eq(profiles.profileId, profile.profileId))
        .returning({ updatedId: profiles.profileId });

    if (result.length === 0) {
        return {
            messages: {
                username: username,
                profileIcon: profileIcon,
                publicEmail: publicEmail ?? "",
            },
            errors: {
                db: [t("DB_ERROR")],
            },
        };
    }

    console.log(result);

    refresh();
    redirect(`/app/profile/${uuidToShort(result[0].updatedId)}`);
}
