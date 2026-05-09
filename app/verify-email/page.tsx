"use client";

import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import BackLink from "@/components/custom/backLink";

import { authClient } from "@/lib/auth-client";

import { LuMoveRight } from "react-icons/lu";

async function sendVerificationEmail(email: string | null) {
    if (!email) return;

    await authClient.sendVerificationEmail({
        email,
        callbackURL: `/app`,
    });
}

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const t = useTranslations("verifyEmail");

    return (
        <main className="relative flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40%">
            <BackLink href="/" label="Back" />
            <div className="flex h-1/2 w-[90%] flex-col items-center justify-between space-y-3 rounded-md border border-neutral-200 bg-white p-5 shadow md:w-1/3 md:p-10">
                <h1 className="text-xl font-bold md:text-3xl">{t("title")}</h1>
                <p className="text-sm md:text-base">{t("thanks")}</p>
                <p className="text-sm md:text-base">
                    {t("paragraph1")}
                    <strong>{email}</strong>
                    {t("paragraph2")}
                </p>
                <div className="flex w-full flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0">
                    <button
                        className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow hover:bg-neutral-100 md:text-base"
                        onClick={() => sendVerificationEmail(email)}
                    >
                        <span>{t("resend")}</span>
                    </button>
                    <Link
                        href="/app"
                        className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-sm text-white shadow hover:bg-blue-600 md:text-base"
                    >
                        <span>{t("continue")}</span>
                        <LuMoveRight />
                    </Link>
                </div>
            </div>
        </main>
    );
}
