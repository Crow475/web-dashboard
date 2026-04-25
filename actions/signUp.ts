"use server";

import { z } from "zod";
import { getTranslations } from "next-intl/server";

export type SignUpActionState = {
    email?: string;
    username?: string;
    password?: string;
    passwordConfirmation?: string;
    profileIcon?: string;
    errors?: {
        email?: string[];
        username?: string[];
        password?: string[];
        passwordConfirmation?: string[];
        profileIcon?: string[];
    };
};

export async function signUp(_prevState: SignUpActionState, formData: FormData): Promise<SignUpActionState> {
    const t = await getTranslations("signUp");

    const signUpSchema = z
        .object({
            email: z.email(t("invalidEmail")),
            username: z.string(t("invalidUsername")).min(4, t("usernameTooShort")).max(63, t("usernameTooLong")).trim(),
            password: z.string(t("invalidPassword")).min(8, t("passwordTooShort")).trim(),
            passwordConfirmation: z.string(t("invalidPasswordConfirmation")),
            profileIcon: z.emoji(t("invalidProfileIcon")).optional(),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            error: t("passwordsDontMatch"),
            path: ["passwordConfirmation"],
        });

    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("repeatPassword") as string;
    const profileIcon = formData.get("profileIcon") as string;

    console.log("Received form data:", { email, username, password, passwordConfirmation });

    const validatedData = signUpSchema.safeParse({
        email,
        username,
        password,
        passwordConfirmation,
        profileIcon,
    });

    if (!validatedData.success) {
        console.log("Validation errors:", validatedData.error.flatten().fieldErrors);

        return {
            email: email,
            username: username,
            password: password,
            passwordConfirmation: passwordConfirmation,
            profileIcon: profileIcon,
            errors: validatedData.error.flatten().fieldErrors,
        };
    }

    console.log("Signing up with:", validatedData.data);

    return { email, username, password, passwordConfirmation };
}
