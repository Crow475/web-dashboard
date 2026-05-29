"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import Image from "next/image";

import { LuTriangleAlert, LuSend, LuCheck } from "react-icons/lu";

import { useTranslations } from "next-intl";

export default function DeleteAccount() {
    const [sent, setSent] = useState(false);

    const t = useTranslations("deleteAccount");

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-tl from-orange-300 via-amber-200 via-10% to-white to-40% bg-cover">
            <div className="z-10 flex h-auto w-[90%] flex-col items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow md:h-[60%] md:w-1/3">
                <div className="flex w-full flex-col items-center justify-center space-y-2 py-4">
                    <LuTriangleAlert className="size-10 text-red-500" />
                    <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-center space-y-3 px-2 py-4">
                    <h2 className="text-center text-lg font-bold">{t("subtitle")}</h2>
                    <p className="text-sm text-neutral-500 md:text-base">{t("paragraph1")}</p>
                    <p className="text-sm text-neutral-500 md:text-base">{t("paragraph2")}</p>
                </div>
                <div className="flex w-full flex-row items-center justify-center px-4 py-4">
                    <button
                        disabled={sent}
                        className="group flex cursor-pointer flex-row items-center justify-start space-x-3 rounded-md border border-neutral-100 bg-white px-4 py-2 text-neutral-500 shadow hover:border-red-300 hover:bg-red-200 hover:text-red-500 hover:shadow-red-200 disabled:cursor-default disabled:border-neutral-100 disabled:text-neutral-200 disabled:hover:bg-white disabled:hover:text-neutral-200 disabled:hover:shadow-current"
                        onClick={async () => {
                            setSent(true);
                            await authClient.deleteUser({
                                callbackURL: "/goodbye",
                            });
                        }}
                    >
                        <span>{t("delete")}</span>
                        <LuSend className="block size-4 group-disabled:hidden md:size-5" />
                        <LuCheck className="hidden size-4 group-disabled:block md:size-5" />
                    </button>
                </div>
            </div>
            <Image
                src="/boards-landing-bg.svg"
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
