"use server";
import { redirect } from "next/navigation";

import { z } from "zod";
import { getTranslations } from "next-intl/server";

import { auth } from "@/lib/auth";

export type ResetPasswordActionState = {
    email?: string;
    errors?: {
        email?: string[];
    };
};

export async function resetPassword(
    _prevState: ResetPasswordActionState,
    formData: FormData,
): Promise<ResetPasswordActionState> {
    const t = await getTranslations("resetPassword");

    const resetPasswordSchema = z.object({
        email: z.email(t("invalidEmail")),
    });

    const email = formData.get("email") as string;

    const validatedData = resetPasswordSchema.safeParse({
        email,
    });

    if (!validatedData.success) {
        return {
            email: email,
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    const data = await auth.api.requestPasswordReset({
        body: {
            email: email,
            redirectTo: `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/new-password`,
        },
    });

    redirect("/password-reset/sent");
}
