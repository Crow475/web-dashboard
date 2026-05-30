"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { montserrat } from "@/lib/fonts";

import { LuMoveLeft, LuMoveUp } from "react-icons/lu";

import AboutLink from "@/components/custom/aboutLink";

import { useTranslations } from "next-intl";

export default function Forbidden() {
    const t = useTranslations("forbidden");
    const router = useRouter();

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <AboutLink />
            <div className="flex h-svh w-full flex-col items-center justify-center space-y-8">
                <div className="flex flex-col items-center justify-center space-y-1">
                    <h1 className={`${montserrat.className} text-7xl font-black select-none md:text-9xl`}>403</h1>
                    <h2 className="text-3xl font-black md:text-3xl">{t("subtitle")}</h2>
                </div>
                <p className="w-[90%] text-center text-neutral-600 md:w-1/3">{t("paragraph1")}</p>
                <div className="flex flex-row items-center justify-center space-x-4">
                    <button
                        className="flex cursor-pointer flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm"
                        onClick={() => router.back()}
                    >
                        <LuMoveLeft />
                        <span>{t("back")}</span>
                    </button>
                    <Link
                        className="flex cursor-pointer flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm"
                        href="/"
                    >
                        <LuMoveUp />
                        <span>{t("home")}</span>
                    </Link>
                </div>
            </div>
            <Image
                src="/error.svg"
                alt="Background Image"
                role="presentation"
                className="pointer-events-none absolute right-0 bottom-0 z-0 m-0 h-full w-full object-cover opacity-40"
                unoptimized
                width={100}
                height={100}
                loading="eager"
            />
        </main>
    );
}
