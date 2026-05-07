"use client";

import { useActionState, useState } from "react";

import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";

import { useTranslations } from "next-intl";

import { signUp, SignUpActionState } from "@/actions/signUp";

import { LuMail, LuRectangleEllipsis, LuAtSign, LuCheck, LuPencil } from "react-icons/lu";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import LanguageSelector from "@/components/custom/languageSelector";
import BackLink from "@/components/custom/backLink";
import AboutLink from "@/components/custom/aboutLink";
import SubmitFormButton from "@/components/custom/submitFormButton";
import setLocale from "@/lib/setLocale";
import { notoColorEmoji } from "@/lib/fonts";

function EmailField({ state, label }: { state: SignUpActionState; label: string }) {
    return (
        <div className="flex w-full flex-col items-start justify-start space-y-1">
            <label htmlFor="email" className="mr-2 text-xs text-neutral-600 md:text-sm">
                {label}
            </label>
            <label
                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow outline-0 outline-red-500/50 focus-within:border-blue-500 has-data-[error=true]:outline-4"
                htmlFor="email"
            >
                <div className="flex w-[12%] text-neutral-400">
                    <LuMail role="presentation" />
                    <span className="sr-only">{label}</span>
                </div>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="flex w-[88%] py-1 text-sm focus:outline-0 md:text-base"
                    data-error={state.errors?.email ? true : false}
                    defaultValue={state.email}
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
    );
}

function PasswordField({ state, label }: { state: SignUpActionState; label: string }) {
    return (
        <div className="flex w-full flex-col items-start justify-start space-y-1">
            <label htmlFor="password" className="mr-2 text-xs text-neutral-600 md:text-sm">
                {label}
            </label>
            <label
                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                htmlFor="password"
            >
                <div className="flex w-[12%] text-neutral-400">
                    <LuRectangleEllipsis role="presentation" />
                    <span className="sr-only">{label}</span>
                </div>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="nd:text-base flex w-[88%] py-1 text-sm focus:outline-0"
                    data-error={state.errors?.password ? true : false}
                    defaultValue={state.password}
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
    );
}

function RepeatedPasswordField({ state, label }: { state: SignUpActionState; label: string }) {
    return (
        <div className="flex w-full flex-col items-start justify-start space-y-1">
            <label htmlFor="repeatPassword" className="mr-2 text-xs text-neutral-600 md:text-sm">
                {label}
            </label>
            <label
                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                htmlFor="repeatPassword"
            >
                <div className="flex w-[12%] text-neutral-400">
                    <LuRectangleEllipsis role="presentation" />
                    <span className="sr-only">{label}</span>
                </div>
                <input
                    type="password"
                    id="repeatPassword"
                    name="repeatPassword"
                    className="flex w-[88%] py-1 text-sm focus:outline-0 md:text-base"
                    data-error={state.errors?.passwordConfirmation ? true : false}
                    defaultValue={state.passwordConfirmation}
                    aria-invalid={state.errors?.passwordConfirmation ? true : false}
                    placeholder="○○○○○○○○"
                    required
                />
            </label>
            <div className="min-h-6">
                {state.errors?.passwordConfirmation && (
                    <span className="text-xs text-red-500/50">{state.errors.passwordConfirmation.join(", ")}</span>
                )}
            </div>
        </div>
    );
}

function IconPicker({
    state,
    selectedEmoji,
    setSelectedEmoji,
    label,
}: {
    state: SignUpActionState;
    selectedEmoji: string;
    label: string;
    setSelectedEmoji: (emoji: string) => void;
}) {
    return (
        <div className="flex w-full flex-col items-start justify-start space-y-1">
            <label htmlFor="profileIcon" className="mr-2 text-xs text-neutral-600 md:text-sm">
                {label}
            </label>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={`group relative flex cursor-pointer flex-row items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 px-[0.3rem] py-1 text-center text-2xl shadow select-none md:px-2 md:py-2.5 md:text-4xl ${notoColorEmoji.className}`}
                        type="button"
                        aria-label="Profile Picture"
                        id="profileIcon"
                    >
                        {selectedEmoji}
                        <input type="hidden" id="profileIcon" name="profileIcon" value={selectedEmoji} />
                        <div className="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center rounded-full bg-blue-300/20 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
                            <LuPencil size={20} className="text-white" />
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <EmojiPicker
                        emojiStyle={EmojiStyle.GOOGLE}
                        onEmojiClick={(emojiObject) => setSelectedEmoji(emojiObject.emoji)}
                        previewConfig={{ showPreview: false }}
                        height={350}
                    />
                </PopoverContent>
            </Popover>
            <div className="min-h-6">
                {state.errors?.username && (
                    <span className="text-xs text-red-500/50">{state.errors?.profileIcon?.join(", ")}</span>
                )}
            </div>
        </div>
    );
}

function UsernameField({ state, label }: { state: SignUpActionState; label: string }) {
    return (
        <div className="flex w-full flex-col items-start justify-start space-y-1">
            <label htmlFor="username" className="mr-2 text-xs text-neutral-600 md:text-sm">
                {label}
            </label>
            <label
                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                htmlFor="username"
            >
                <div className="flex w-[12%] text-neutral-400">
                    <LuAtSign role="presentation" />
                    <span className="sr-only">{label}</span>
                </div>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="flex w-[88%] py-1 text-sm focus:outline-0 md:text-base"
                    data-error={state.errors?.username ? true : false}
                    defaultValue={state.username}
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
    );
}

export default function SignUpPage() {
    const t = useTranslations("signUp");
    const [state, formAction, pending] = useActionState(signUp, {});
    const [selectedEmoji, setSelectedEmoji] = useState("👤");

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <BackLink href="/" label={t("back")} />
            <AboutLink />
            <div className="z-10 flex h-2/3 w-[90%] flex-col items-center rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow md:w-2/5">
                <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
                <form
                    className="hidden h-[90%] w-[90%] flex-col items-center justify-between md:flex"
                    action={formAction}
                >
                    <div className="flex h-full w-full flex-row items-start justify-between py-4">
                        <div className="flex h-full w-[47%] flex-col items-start justify-between space-y-2">
                            <EmailField state={state} label={t("email")} />
                            <Separator orientation="horizontal" />
                            <div className="flex flex-col justify-end space-y-2">
                                <PasswordField state={state} label={t("password")} />
                                <RepeatedPasswordField state={state} label={t("repeatPassword")} />
                            </div>
                        </div>
                        <Separator orientation="vertical" className="mx-6" />
                        <div className="flex h-full w-[47%] flex-col items-start justify-between space-y-2">
                            <div className="flex flex-col items-start justify-start">
                                <IconPicker
                                    state={state}
                                    selectedEmoji={selectedEmoji}
                                    setSelectedEmoji={setSelectedEmoji}
                                    label={t("profilePicture")}
                                />
                                <UsernameField state={state} label={t("username")} />
                            </div>
                            <div className="flex flex-row pb-6">
                                <p className="text-sm text-neutral-300">{t("disclaimer")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-row items-center justify-center">
                        <SubmitFormButton pending={pending} label={t("submit")} icon={<LuCheck />} />
                    </div>
                </form>
                <ScrollArea className="h-[95%] w-full px-3 md:hidden">
                    <form
                        className="flex h-full w-full flex-col items-center justify-start space-y-2 px-2"
                        action={formAction}
                    >
                        <EmailField state={state} label={t("email")} />
                        <Separator orientation="horizontal" />
                        <IconPicker
                            state={state}
                            selectedEmoji={selectedEmoji}
                            setSelectedEmoji={setSelectedEmoji}
                            label={t("profilePicture")}
                        />
                        <UsernameField state={state} label={t("username")} />
                        <Separator orientation="horizontal" />
                        <PasswordField state={state} label={t("password")} />
                        <RepeatedPasswordField state={state} label={t("repeatPassword")} />
                        <div className="flex w-full flex-row items-center justify-center">
                            <SubmitFormButton pending={pending} label={t("submit")} icon={<LuCheck />} />
                        </div>
                    </form>
                </ScrollArea>
            </div>
            <LanguageSelector localeChangeHandler={setLocale} />
            <Image
                src="/triangles.svg"
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
