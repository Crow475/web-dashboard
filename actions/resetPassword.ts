"use server";

import { z } from "zod";
import { getTranslations } from "next-intl/server";

import { sendEmail } from "./sendEmail";

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

    await sendEmail(email, "reset password test", "<p>test</p>");

    return {
        email: email,
    };
}
