"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { getTranslations } from "next-intl/server";

import type { actionState } from "@/lib/types";

import { auth } from "@/lib/auth";
import { isAPIError } from "better-auth/api";

export type SetNewPasswordActionState = actionState & {
    messages: {
        password: string;
        passwordConfirmation: string;
        token: string;
    };
    errors?: {
        password?: string[];
        passwordConfirmation?: string[];
    };
};

export async function setNewPassword(
    _prevState: SetNewPasswordActionState,
    formData: FormData,
): Promise<SetNewPasswordActionState> {
    const t = await getTranslations("newPassword");

    const setNewPasswordSchema = z
        .object({
            password: z.string(t("invalidPassword")).min(8, t("passwordTooShort")).trim(),
            passwordConfirmation: z.string(t("invalidPasswordConfirmation")),
            token: z.string(t("invalidToken")),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            error: t("passwordsDontMatch"),
            path: ["passwordConfirmation"],
        });

    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("repeatPassword") as string;
    const token = formData.get("token") as string;

    const validatedData = setNewPasswordSchema.safeParse({
        password,
        passwordConfirmation,
        token,
    });

    if (!validatedData.success) {
        return {
            messages: {
                password: password,
                passwordConfirmation: passwordConfirmation,
                token: token,
            },
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await auth.api.resetPassword({
            body: {
                newPassword: password,
                token,
            },
        });

        console.log("Result:", result);
    } catch (error) {
        if (isAPIError(error)) {
            return {
                messages: {
                    password: password,
                    passwordConfirmation: passwordConfirmation,
                    token: token,
                },
                errors: {
                    token: [t(error.body?.code ?? "UNKNOWN_ERROR")],
                },
            };
        }

        return {
            messages: {
                password: password,
                passwordConfirmation: passwordConfirmation,
                token: token,
            },
            errors: {
                token: [t("UNKNOWN_ERROR")],
            },
        };
    }

    redirect("/sign-in");
}
