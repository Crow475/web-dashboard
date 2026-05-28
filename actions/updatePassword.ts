"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { actionState } from "@/lib/types";

import { z } from "zod";

import { auth } from "@/lib/auth";
import { isAPIError } from "better-auth/api";

import { getTranslations } from "next-intl/server";

export type UpdatePasswordActionState = actionState & {
    messages: {
        oldPassword: string;
        newPassword: string;
        newPasswordConfirmation: string;
    };
    errors?: {
        oldPassword?: string[];
        newPassword?: string[];
        newPasswordConfirmation?: string[];
        auth?: string[];
    };
};

export async function updatePassword(
    _prevState: UpdatePasswordActionState,
    formData: FormData,
): Promise<UpdatePasswordActionState> {
    const t = await getTranslations("changePassword");

    const updatePasswordSchema = z
        .object({
            oldPassword: z.string(t("invalidPassword")).min(8, t("passwordTooShort")).trim(),
            newPassword: z.string(t("invalidPassword")).min(8, t("passwordTooShort")).trim(),
            newPasswordConfirmation: z.string("invalidPasswordConfirmation"),
        })
        .refine((data) => data.newPassword === data.newPasswordConfirmation, {
            error: t("passwordsDontMatch"),
            path: ["newPasswordConfirmation"],
        });

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const newPasswordConfirmation = formData.get("repeatNewPassword") as string;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            messages: {
                oldPassword: oldPassword,
                newPassword: newPassword,
                newPasswordConfirmation: newPasswordConfirmation,
            },
            errors: {
                auth: [t("invalidSession")],
            },
        };
    }

    const validatedData = updatePasswordSchema.safeParse({
        oldPassword,
        newPassword,
        newPasswordConfirmation,
    });

    if (!validatedData.success) {
        return {
            messages: {
                oldPassword: oldPassword,
                newPassword: newPassword,
                newPasswordConfirmation: newPasswordConfirmation,
            },
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await auth.api.changePassword({
            body: {
                newPassword: newPassword,
                currentPassword: oldPassword,
                revokeOtherSessions: true,
            },
            headers: await headers(),
        });
    } catch (error) {
        if (isAPIError(error)) {
            return {
                messages: {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    newPasswordConfirmation: newPasswordConfirmation,
                },
                errors: {
                    auth: [t(error.body?.code ?? "UNKNOWN_ERROR")],
                },
            };
        }

        return {
            messages: {
                oldPassword: oldPassword,
                newPassword: newPassword,
                newPasswordConfirmation: newPasswordConfirmation,
            },
            errors: {
                auth: [t("UNKNOWN_ERROR")],
            },
        };
    }

    redirect("/app/settings");
}
