"use client";

import { useActionState } from "react";

import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";

import AboutLink from "@/components/custom/aboutLink";
import SubmitFormButton from "@/components/custom/submitFormButton";
import LanguageSelector from "@/components/custom/languageSelector";
import setLocale from "@/lib/setLocale";

import { setNewPassword } from "@/actions/setNewPassword";

import { useTranslations } from "next-intl";

import { LuRectangleEllipsis, LuCheck } from "react-icons/lu";

export default function NewPasswordPage() {
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    if (!token) {
        notFound();
    }

    const [state, formAction, pending] = useActionState(setNewPassword, {
        messages: { password: "", passwordConfirmation: "", token: "" },
    });

    const t = useTranslations("newPassword");

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <AboutLink />
            <div className="z-10 flex h-auto w-[90%] flex-col items-center rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow md:h-1/2 md:w-1/4">
                <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
                <form
                    className="flex h-full w-[90%] flex-col items-center justify-between pt-5 md:w-[80%]"
                    action={formAction}
                >
                    <div className="flex w-full flex-col items-start justify-start space-y-1">
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="password" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("password")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
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
                                    className="flex w-[90%] py-1 text-sm focus:outline-0 md:text-base"
                                    data-error={state.errors?.password ? true : false}
                                    defaultValue={state.messages.password}
                                    aria-invalid={state.errors?.password ? true : false}
                                    placeholder="○○○○○○○○"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.password && (
                                    <span className="text-xs text-red-500/50">{state.errors.password.join(", ")}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="repeatPassword" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("repeatPassword")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                htmlFor="repeatPassword"
                            >
                                <div className="flex w-[12%] text-neutral-400">
                                    <LuRectangleEllipsis role="presentation" />
                                    <span className="sr-only">{t("repeatPassword")}</span>
                                </div>
                                <input
                                    type="password"
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    className="flex w-[88%] py-1 text-sm focus:outline-0 md:text-base"
                                    data-error={state.errors?.passwordConfirmation ? true : false}
                                    defaultValue={state.messages.passwordConfirmation}
                                    aria-invalid={state.errors?.passwordConfirmation ? true : false}
                                    placeholder="○○○○○○○○"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.passwordConfirmation && (
                                    <span className="text-xs text-red-500/50">
                                        {state.errors.passwordConfirmation.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <input type="hidden" name="token" value={token} />
                    <div className="min-h-6">
                        {state.errors?.token && (
                            <span className="text-xs text-red-500/50">{state.errors.token.join(", ")}</span>
                        )}
                    </div>
                    <div className="mt-6 flex w-full flex-row items-center justify-center">
                        <SubmitFormButton pending={pending} label={t("submit")} icon={<LuCheck />} />
                    </div>
                </form>
            </div>
            <LanguageSelector localeChangeHandler={setLocale} />
            <Image
                src="/random.svg"
                alt="Background Image"
                role="presentation"
                className="pointer-events-none absolute right-0 bottom-0 z-0 m-0 h-full w-2/3 object-cover opacity-50 md:w-full"
                unoptimized
                width={100}
                height={100}
                loading="eager"
            />
        </main>
    );
}
