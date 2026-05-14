"use server";

import type { actionState } from "@/lib/types";

import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isAPIError } from "better-auth/api";

export type SignInActionState = actionState & {
    messages: {
        email?: string;
        passsword?: string;
        response?: Response;
    };
    errors?: {
        email?: string[];
        password?: string[];
    };
};

export async function signIn(_prevState: SignInActionState, formData: FormData): Promise<SignInActionState> {
    const t = await getTranslations("signIn");

    const signInSchema = z.object({
        email: z.email(t("invalidEmail")),
        password: z.string(t("invalidPassword")).min(8, t("passwordTooShort")).trim(),
    });

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedData = signInSchema.safeParse({
        email,
        password,
    });

    if (!validatedData.success) {
        return {
            messages: {
                email: email,
                passsword: password,
            },
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });
    } catch (error) {
        if (isAPIError(error)) {
            console.error("Sign-in error:", error);

            if (error.body?.code === "EMAIL_NOT_VERIFIED") {
                redirect(`/verify-email?email=${email}`);
            }

            return {
                messages: {
                    email: email,
                    passsword: password,
                },
                errors: {
                    password: [t(error.body?.code ?? "UNKNOWN_ERROR")],
                },
            };
        }

        console.error("Unexpected error during sign-in:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : "No stack trace available",
        });

        return {
            messages: {
                email: email,
                passsword: password,
            },
            errors: {
                password: [t("UNKNOWN_ERROR")],
            },
        };
    }

    redirect("/app/");
}
