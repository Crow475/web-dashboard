"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import { useTranslations, useLocale } from "next-intl";

import setLocale from "@/lib/setLocale";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { notoColorEmoji } from "@/lib/fonts";

import DefaultHeader from "@/components/custom/defaultHeader";

import { LuSettings, LuChevronRight, LuMail } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Settings() {
    const t = useTranslations("settings");
    const locale = useLocale();

    const loginMethod = authClient.getLastUsedLoginMethod();

    console.log("Current locale:", locale);
    console.log("Current login method:", loginMethod);

    const methodIcon = () => {
        switch (loginMethod) {
            case "email":
                return <LuMail role="presentation" />;
            case "github":
                return <FaGithub role="presentation" />;
            case "google":
                return <FcGoogle role="presentation" />;
            default:
                return <LuMail role="presentation" />;
        }
    };

    return (
        <main className="flex w-full flex-col items-center justify-start">
            <DefaultHeader title={t("title")} icon={<LuSettings size={32} />} />
            <ScrollArea className="flex h-[90vh] w-full flex-col items-start justify-start pr-4 md:w-3/4 md:px-10">
                <div className="flex w-full pt-10"></div>
                <h2 className="py-4 text-xl font-bold md:text-2xl">{t("headers.interface")}</h2>
                <div className="flex w-full flex-row items-center justify-between px-2">
                    <div className="flex flex-col items-start justify-start">
                        <label className="text-base font-bold md:text-lg" id="languageSelect">
                            {t("language.label")}
                        </label>
                        <p className="text-xs text-neutral-500 md:text-sm">{t("language.description")}</p>
                    </div>
                    <Select onValueChange={setLocale} defaultValue={locale}>
                        <SelectTrigger className="w-32 md:w-40" aria-labelledby="languageSelect">
                            <SelectValue className="text-sm md:text-base" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">
                                <span className={notoColorEmoji.className}>🇬🇧</span>
                                <span>English</span>
                            </SelectItem>
                            <SelectItem value="ru">
                                <span className={notoColorEmoji.className}>🇷🇺</span>
                                <span>Русский</span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator className="my-6" />
                <h2 className="py-4 text-xl font-bold md:text-2xl">{t("headers.account")}</h2>
                <div className="flex w-full flex-row items-center justify-between px-2">
                    <div className="flex flex-col items-start justify-start">
                        <span className="text-base font-bold group-data-disabled:text-neutral-300 md:text-lg">
                            {t("loginMethod.label")}
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <div className="flex flex-row items-center justify-start space-x-2 rounded-md border border-neutral-100 bg-neutral-50 px-2 py-1 text-neutral-600">
                            {methodIcon()}
                            <span className="text-sm md:text-base">{t(`loginMethod.${loginMethod}`)}</span>
                        </div>
                    </div>
                </div>
                <Separator className="my-6" />
                <div
                    className={`group flex w-full flex-row items-center justify-between px-2`}
                    data-disabled={loginMethod !== "email"}
                >
                    <div className="flex flex-col items-start justify-start">
                        <label
                            className="text-base font-bold group-data-disabled:text-neutral-300 md:text-lg"
                            id="languageSelect"
                        >
                            {t("changePassword.label")}
                        </label>
                        <p className="text-xs text-neutral-500 group-data-disabled:text-neutral-200 md:text-sm">
                            {t("changePassword.description")}
                        </p>
                    </div>
                    <Link
                        className="flex flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-4 py-2 text-sm text-neutral-500 shadow group-data-disabled:pointer-events-none group-data-disabled:border-neutral-50 group-data-disabled:text-neutral-200 hover:border-amber-300 hover:bg-amber-200 hover:text-amber-500 hover:shadow-amber-200 md:text-base"
                        href="/app/change-password"
                    >
                        {t("changePassword.button")}
                        <LuChevronRight className="size-4 md:size-5" />
                    </Link>
                </div>
                <Separator className="my-6" />
                <div className="flex w-full flex-row items-center justify-between px-2">
                    <div className="flex flex-col items-start justify-start">
                        <label className="text-base font-bold text-red-500 md:text-lg" id="languageSelect">
                            {t("deleteAccount.label")}
                        </label>
                        <p className="text-xs text-neutral-500 md:text-sm">{t("deleteAccount.description")}</p>
                    </div>
                    <Link
                        className="flex flex-row items-center justify-start space-x-1 rounded-md border border-neutral-100 bg-white px-4 py-2 text-sm text-neutral-500 shadow hover:border-red-300 hover:bg-red-200 hover:text-red-500 hover:shadow-red-200 md:text-base"
                        href="/app/delete-account"
                    >
                        {t("deleteAccount.button")}
                        <LuChevronRight className="size-4 md:size-5" />
                    </Link>
                </div>
                <Separator className="my-6" />
            </ScrollArea>
        </main>
    );
}
