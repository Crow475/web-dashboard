"use server";

import { z } from "zod";
import { getTranslations } from "next-intl/server";

export type SignInActionState = {
    email?: string;
    passsword?: string;
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

    // console.log("Received form data:", { email, password });

    const validatedData = signInSchema.safeParse({
        email,
        password,
    });

    if (!validatedData.success) {
        // console.log("Validation errors:", validatedData.error.flatten().fieldErrors);

        return {
            email: email,
            passsword: password,
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    // console.log("Signing in with:", validatedData.data);

    return { email: email, passsword: password };
}
