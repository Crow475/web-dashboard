"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { createDashboard } from "@/actions/createDashboard";

import { LuCheck, LuMoveLeft, LuCaseSensitive } from "react-icons/lu";

import SubmitFormButton from "@/components/custom/submitFormButton";
import IconPicker from "@/components/custom/iconPicker";

export default function CreateDashboardPage() {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(createDashboard, { messages: {} });
    const [selectedEmoji, setSelectedEmoji] = useState("📊");

    const t = useTranslations("createDashboard");

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-linear-to-tl from-blue-400 via-blue-300 via-10% to-white to-50% md:to-40%">
            <main className="flex h-[70%] w-[90%] flex-col rounded-lg border border-neutral-200 bg-white pt-2 shadow md:h-[90%] md:w-[40%]">
                <div className="flex w-full flex-row items-center justify-center">
                    <h1 className="p-4 text-2xl font-semibold md:text-4xl">{t("pageTitle")}</h1>
                </div>
                <form
                    className="flex h-full flex-col items-center justify-between px-5 py-5 md:px-10"
                    action={formAction}
                >
                    <div className="flex w-[90%] flex-col items-start justify-start space-y-2">
                        <div className="flex w-full flex-row items-center justify-start">
                            <IconPicker
                                id="icon"
                                state={state}
                                selectedEmoji={selectedEmoji}
                                setSelectedEmoji={setSelectedEmoji}
                                label={t("icon")}
                            />
                        </div>
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="title" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("title")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow outline-0 outline-red-500/50 focus-within:border-blue-500 has-data-[error=true]:outline-4"
                                htmlFor="title"
                            >
                                <div className="flex w-[8%] text-neutral-400">
                                    <LuCaseSensitive role="presentation" />
                                    <span className="sr-only">{t("title")}</span>
                                </div>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="flex w-[92%] py-1 text-sm focus:outline-0 md:text-base"
                                    data-error={state.errors?.title ? true : false}
                                    defaultValue={state.messages.title}
                                    aria-invalid={state.errors?.title ? true : false}
                                    placeholder={t("titlePlaceholder")}
                                    autoComplete="off"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.title && (
                                    <span className="text-xs text-red-500/50">{state.errors.title.join(", ")}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <div className="flex w-full flex-row items-center justify-between">
                                <label htmlFor="isPrivate" className="mr-2 text-sm md:text-base">
                                    {t("private")}
                                </label>
                                <input
                                    type="checkbox"
                                    id="isPrivate"
                                    name="isPrivate"
                                    className="h-4 w-4 rounded border-neutral-200 text-blue-500 focus:ring-blue-500"
                                    defaultChecked={state.messages.isPrivate}
                                />
                            </div>
                            <p className="px-3 text-[0.7rem] text-neutral-500 md:text-xs">{t("privateDescription")}</p>
                            <div className="min-h-6">
                                {state.errors?.isPrivate && (
                                    <span className="text-xs text-red-500/50">{state.errors.isPrivate.join(", ")}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex min-h-6 w-full flex-row items-center justify-start">
                        {state.errors?.auth && (
                            <span className="text-xs text-red-500/50">{state.errors.auth.join(", ")}</span>
                        )}
                    </div>
                    <div className="flex w-full flex-row items-center justify-between">
                        <button
                            className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-400 md:text-sm"
                            type="button"
                            onClick={() => {
                                router.back();
                            }}
                        >
                            <LuMoveLeft />
                            <span>{t("cancel")}</span>
                        </button>
                        <SubmitFormButton label={t("submit")} pending={pending} icon={<LuCheck />} />
                    </div>
                </form>
            </main>
        </div>
    );
}
