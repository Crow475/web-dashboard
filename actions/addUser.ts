"use server";

import type { profileSelectReturn } from "@/lib/types";

import getProfileById from "@/actions/getProfileById";

import type { actionState } from "@/lib/types";

import { getTranslations } from "next-intl/server";

import { z } from "zod";

export type AddUserActionState = actionState & {
    messages: {
        userId?: string;
    };
    errors?: {
        userId?: string[];
    };
    profile?: profileSelectReturn;
};

export async function addUser(_prevState: AddUserActionState, formData: FormData) {
    const userId = formData.get("userid") as string;

    const t = await getTranslations("editDashboard.addUserDialog");

    const schema = z.object({
        userId: z.string(t("userNotFound")).regex(/^[a-zA-Z0-9]+$/, t("userNotFound")),
    });

    if (!userId) {
        return {
            messages: {
                userId: userId,
            },
            errors: {
                userId: [t("idRequired")],
            },
        };
    }

    const validatedData = schema.safeParse({
        userId: userId,
    });

    if (!validatedData.success) {
        return {
            messages: {
                userId: userId,
            },
            errors: {
                userId: [t("userNotFound")],
            },
        };
    }

    const profile = await getProfileById(userId);

    if (!profile) {
        return {
            messages: {
                userId: userId,
            },
            errors: {
                userId: [t("userNotFound")],
            },
        };
    }

    return {
        messages: {
            userId: userId,
        },
        profile: profile,
    };
}
