"use client";
import Link from "next/link";
import { useActionState } from "react";

import { signIn } from "@/actions/signIn";

import { LuMail, LuMoveRight, LuRectangleEllipsis } from "react-icons/lu";

import SubmitFormButton from "./submitFormButton";

import { useTranslations } from "next-intl";

export default function SignInForm() {
    const t = useTranslations("signIn");
    const [state, formAction, pending] = useActionState(signIn, {});

    return (
        <form className="flex h-full w-[80%] flex-col items-center justify-between" action={formAction}>
            <div className="flex w-full flex-col items-center space-y-2">
                <div className="flex w-full flex-col items-start justify-start space-y-1">
                    <label htmlFor="email" className="mr-2 text-sm text-neutral-600">
                        {t("email")}
                    </label>
                    <label
                        className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow outline-0 outline-red-500/50 focus-within:border-blue-500 has-data-[error=true]:outline-4"
                        htmlFor="email"
                    >
                        <div className="flex w-[10%] text-neutral-400">
                            <LuMail role="presentation" />
                            <span className="sr-only">{t("email")}</span>
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="flex w-[90%] py-1 focus:outline-0"
                            required
                            data-error={state.errors?.email ? true : false}
                            defaultValue={state.email}
                            aria-invalid={state.errors?.email ? true : false}
                            placeholder="user@example.com"
                        />
                    </label>
                </div>
                <div className="flex w-full flex-col items-start justify-start space-y-1">
                    <label htmlFor="password" className="mr-2 text-sm text-neutral-600">
                        {t("password")}
                    </label>
                    <label
                        className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow outline-0 outline-red-500/50 focus-within:border-blue-500 has-data-[error=true]:outline-4"
                        htmlFor="password"
                    >
                        <div className="flex w-[10%] text-neutral-400">
                            <LuRectangleEllipsis role="presentation" />
                            <span className="sr-only">{t("password")}</span>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="flex w-[90%] py-1 focus:outline-0"
                            required
                            data-error={state.errors?.password ? true : false}
                            defaultValue={state.passsword}
                            aria-invalid={state.errors?.password ? true : false}
                            placeholder="○○○○○○○○"
                        />
                    </label>
                </div>
            </div>

            {state.errors && (
                <div className="flex w-full flex-col items-start justify-start space-y-1 pt-1">
                    {state.errors.email && (
                        <span className="text-sm text-red-500/50">{state.errors.email.join(", ")}</span>
                    )}
                    {state.errors.password && (
                        <span className="text-sm text-red-500/50">{state.errors.password.join(", ")}</span>
                    )}
                </div>
            )}

            <div className="flex w-full flex-row items-center justify-between pt-2">
                <Link href="/password-reset" className="text-sm text-neutral-400 hover:underline">
                    {t("forgotPassword")}
                </Link>

                <SubmitFormButton pending={pending} label={t("submit")} icon={<LuMoveRight />} />
            </div>
        </form>
    );
}
