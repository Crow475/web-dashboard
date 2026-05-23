"use client";

import { useState, useActionState } from "react";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import IconPicker from "@/components/custom/iconPicker";
import SubmitFormButton from "@/components/custom/submitFormButton";

import uuidToShort from "@/lib/uuidToShort";

import { updateProfile } from "@/actions/updateProfile";

import { LuAtSign, LuMail, LuCheck, LuMoveLeft } from "react-icons/lu";

export default function ProfileEditor({
    profile,
}: {
    profile: { profileId: string; username: string; icon: string | null; publicEmail: string | null; userId: string };
}) {
    const [state, formAction, pending] = useActionState(updateProfile, {
        messages: { username: profile.username, publicEmail: profile.publicEmail ?? "" },
        errors: {},
    });
    const [slectedIcon, setSelectedIcon] = useState(profile.icon ?? "");
    const [publicEmailShown, setPublicEmailShown] = useState(profile.publicEmail !== null);
    const [publicEmail, setPublicEmail] = useState(profile.publicEmail ?? "");

    const t = useTranslations("editProfile");

    return (
        <ScrollArea className="h-[89vh] w-[90%] overflow-y-hidden">
            <div className="flex w-full flex-col items-center justify-start">
                <form
                    className="flex w-full flex-col items-center justify-start space-y-2 py-6 md:w-2/3"
                    action={formAction}
                >
                    <IconPicker
                        state={state}
                        id="profileIcon"
                        selectedEmoji={slectedIcon}
                        setSelectedEmoji={setSelectedIcon}
                        label={t("profileIcon")}
                    />
                    <div className="flex w-full flex-row items-center justify-start">
                        <div className="flex w-2/3 flex-col items-start justify-start space-y-1 md:w-1/3">
                            <label htmlFor="username" className="mr-2 text-xs text-neutral-600 md:text-sm">
                                {t("username")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                htmlFor="username"
                            >
                                <div className="flex w-[12%] text-neutral-400">
                                    <LuAtSign role="presentation" />
                                    <span className="sr-only">{t("username")}</span>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="flex w-[88%] py-1 text-sm focus:outline-0 md:text-base"
                                    data-error={state.errors?.username ? true : false}
                                    defaultValue={state.messages.username}
                                    aria-invalid={state.errors?.username ? true : false}
                                    placeholder="username"
                                    required
                                />
                            </label>
                            <div className="min-h-6">
                                {state.errors?.username && (
                                    <span className="text-xs text-red-500/50">{state.errors.username.join(", ")}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Separator orientation="horizontal" />
                    <div className="flex w-full flex-row items-center justify-start">
                        <div className="flex w-2/3 flex-col items-start justify-start space-y-1 py-2 md:w-1/2">
                            <div className="flex w-full flex-row items-center justify-between">
                                <label htmlFor="publicEmailCheckbox" className="w-2/3 text-sm md:text-base">
                                    {t("publicEmail")}
                                </label>
                            </div>
                            <p className="px-2 text-[0.7rem] text-neutral-500 md:text-xs">
                                {t("publicEmailDescription")}
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm shadow outline-0 focus-within:border-blue-500"
                            id="publicEmailCheckbox"
                            name="publicEmailCheckbox"
                            checked={publicEmailShown}
                            onChange={(e) => {
                                setPublicEmailShown(e.target.checked);
                            }}
                        />
                    </div>
                    <div className="flex w-full flex-row items-center justify-start">
                        <div className="flex w-2/3 flex-col items-start justify-start space-y-1 md:w-1/3">
                            <label
                                className="flex w-full flex-row-reverse items-center justify-start rounded-sm border border-neutral-200 px-2 shadow outline-0 outline-red-500/50 focus-within:border-blue-500 has-disabled:bg-neutral-50 has-disabled:outline-0 has-data-[error=true]:outline-4"
                                htmlFor="publicEmail"
                            >
                                <input
                                    type="publicEmail"
                                    id="publicEmail"
                                    name="publicEmail"
                                    className="peer flex w-[88%] py-1 text-sm focus:outline-0 disabled:text-neutral-400 md:text-base"
                                    data-error={state.errors?.publicEmail ? true : false}
                                    value={publicEmailShown ? publicEmail : ""}
                                    onChange={(e) => setPublicEmail(e.target.value)}
                                    aria-invalid={state.errors?.publicEmail ? true : false}
                                    placeholder="user@example.com"
                                    disabled={!publicEmailShown}
                                />
                                <div className="flex w-[12%] text-neutral-400 peer-disabled:text-neutral-300">
                                    <LuMail role="presentation" />
                                    <span className="sr-only">{t("publicEmail")}</span>
                                </div>
                            </label>
                            <div className="min-h-6">
                                {state.errors?.publicEmail && (
                                    <span className="text-xs text-red-500/50">
                                        {state.errors.publicEmail.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Separator orientation="horizontal" />
                    <div className="flex h-8 w-full">
                        {state.errors?.auth && (
                            <span className="text-xs text-red-500/50">{state.errors.auth.join(", ")}</span>
                        )}
                        {state.errors?.db && (
                            <span className="text-xs text-red-500/50">{state.errors.db.join(", ")}</span>
                        )}
                    </div>
                    <div className="flex h-24 w-full"></div>
                    <div className="absolute right-[5%] bottom-2 left-[5%] flex w-[90%] flex-row items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/50 p-2 shadow backdrop-blur-md md:right-[10%] md:left-[10%] md:w-[80%] md:rounded-2xl md:p-4">
                        <Link
                            href={`/app/profile/${uuidToShort(profile.profileId)}`}
                            className="flex flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm"
                        >
                            <LuMoveLeft />
                            <span>{t("cancel")}</span>
                        </Link>
                        <SubmitFormButton pending={pending} label={t("save")} icon={<LuCheck />} />
                    </div>
                </form>
            </div>
        </ScrollArea>
    );
}
