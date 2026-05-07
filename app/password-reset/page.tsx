"use client";

import { useActionState } from "react";

import Image from "next/image";

import { resetPassword } from "@/actions/resetPassword";

import { useTranslations } from "next-intl";

import { LuMail, LuSend } from "react-icons/lu";

import LanguageSelector from "@/components/custom/languageSelector";
import SubmitFormButton from "@/components/custom/submitFormButton";
import AboutLink from "@/components/custom/aboutLink";
import BackLink from "@/components/custom/backLink";
import setLocale from "@/lib/setLocale";

export default function ResetPasswordPage() {
    const t = useTranslations("resetPassword");
    const [state, formAction, pending] = useActionState(resetPassword, {});

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <BackLink href="/sign-in" label={t("back")} />
            <AboutLink />
            <div className="z-10 flex h-auto w-[90%] flex-col items-center rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow md:h-5/12 md:w-1/4">
                <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
                <form
                    className="flex h-full w-[90%] flex-col items-center justify-between pt-5 md:w-[80%]"
                    action={formAction}
                >
                    <div className="flex h-full w-full flex-col items-center justify-between space-y-2">
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="email" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("email")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                htmlFor="email"
                            >
                                <div className="flex w-[10%] text-neutral-400">
                                    <LuMail />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="flex w-[90%] py-1 text-sm focus:outline-0"
                                    defaultValue={state.email}
                                    data-error={state.errors?.email ? true : false}
                                    aria-invalid={state.errors?.email ? true : false}
                                    placeholder="user@example.com"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.email && (
                                    <span className="text-xs text-red-500/50">{state.errors.email.join(", ")}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 md:text-sm">{t("resetText")}</p>
                        </div>
                        <div className="mt-6 flex w-full flex-row items-center justify-center">
                            <SubmitFormButton pending={pending} label={t("submit")} icon={<LuSend />} />
                        </div>
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
