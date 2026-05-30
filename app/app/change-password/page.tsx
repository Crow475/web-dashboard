"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { useActionState } from "react";

import { updatePassword } from "@/actions/updatePassword";

import { authClient } from "@/lib/auth-client";

import { Separator } from "@/components/ui/separator";

import { useTranslations } from "next-intl";

import { LuRectangleEllipsis, LuCheck, LuMoveLeft } from "react-icons/lu";

import SubmitFormButton from "@/components/custom/submitFormButton";

export default function ChangePassword() {
    const [state, formAction, pending] = useActionState(updatePassword, {
        messages: { oldPassword: "", newPassword: "", newPasswordConfirmation: "" },
    });
    const t = useTranslations("changePassword");

    const loginMethod = authClient.getLastUsedLoginMethod();

    if (loginMethod !== "email") {
        notFound();
    }

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-tl from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <div className="z-10 flex h-auto w-[90%] flex-col items-center rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow md:h-2/3 md:w-1/3">
                <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
                <form
                    className="flex h-full w-[90%] flex-col items-center justify-between pt-5 md:w-[80%]"
                    action={formAction}
                >
                    <div className="flex w-full flex-col items-start justify-start space-y-1">
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="oldPassword" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("oldPassword")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                htmlFor="oldPassword"
                            >
                                <div className="flex w-[8%] text-neutral-400">
                                    <LuRectangleEllipsis role="presentation" />
                                    <span className="sr-only">{t("oldPassword")}</span>
                                </div>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    name="oldPassword"
                                    className="flex w-[92%] py-1 text-sm focus:outline-0 md:text-base"
                                    data-error={state.errors?.oldPassword ? true : false}
                                    defaultValue={state.messages.oldPassword}
                                    aria-invalid={state.errors?.oldPassword ? true : false}
                                    placeholder="○○○○○○○○"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.oldPassword && (
                                    <span className="text-xs text-red-500/50">
                                        {state.errors.oldPassword.join(", ")}
                                    </span>
                                )}
                                {state.errors?.auth && (
                                    <span className="text-xs text-red-500/50">{state.errors.auth.join(", ")}</span>
                                )}
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="newPassword" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("newPassword")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                htmlFor="newPassword"
                            >
                                <div className="flex w-[8%] text-neutral-400">
                                    <LuRectangleEllipsis role="presentation" />
                                    <span className="sr-only">{t("newPassword")}</span>
                                </div>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    className="flex w-[92%] py-1 text-sm focus:outline-0 md:text-base"
                                    data-error={state.errors?.newPassword ? true : false}
                                    defaultValue={state.messages.newPassword}
                                    aria-invalid={state.errors?.newPassword ? true : false}
                                    placeholder="○○○○○○○○"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.newPassword && (
                                    <span className="text-xs text-red-500/50">
                                        {state.errors.newPassword.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="repeatNewPassword" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("repeatNewPassword")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                htmlFor="repeatNewPassword"
                            >
                                <div className="flex w-[8%] text-neutral-400">
                                    <LuRectangleEllipsis role="presentation" />
                                    <span className="sr-only">{t("repeatNewPassword")}</span>
                                </div>
                                <input
                                    type="password"
                                    id="repeatNewPassword"
                                    name="repeatNewPassword"
                                    className="flex w-[92%] py-1 text-sm focus:outline-0 md:text-base"
                                    data-error={state.errors?.newPasswordConfirmation ? true : false}
                                    defaultValue={state.messages.newPasswordConfirmation}
                                    aria-invalid={state.errors?.newPasswordConfirmation ? true : false}
                                    placeholder="○○○○○○○○"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.newPasswordConfirmation && (
                                    <span className="text-xs text-red-500/50">
                                        {state.errors.newPasswordConfirmation.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex w-full flex-row items-center justify-between">
                        <Link
                            href={`/app/settings`}
                            className="flex flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm"
                        >
                            <LuMoveLeft />
                            <span>{t("cancel")}</span>
                        </Link>
                        <SubmitFormButton pending={pending} label={t("submit")} icon={<LuCheck />} />
                    </div>
                </form>
            </div>
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
