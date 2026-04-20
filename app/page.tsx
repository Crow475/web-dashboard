import Link from "next/link";
import Image from "next/image";

import { useTranslations } from "next-intl";

import { LuRocket, LuUserPlus } from "react-icons/lu";

import { montserrat } from "@/lib/fonts";

import LanguageSelector from "@/components/custom/languageSelector";
import setLocale from "@/lib/setLocale";

export default function LandingPage() {
    const t = useTranslations("landing");

    return (
        <main className="static flex h-screen w-full flex-col items-center justify-start space-y-24 bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover px-10 py-40">
            <div className="z-10 flex flex-col items-center justify-center">
                <h1 className={`text-9xl font-black select-none ${montserrat.className}`}>{t("title")}</h1>
                <span className="text-sm select-none">{t("subtitle")}</span>
            </div>
            <div className="z-10 grid w-1/4 grid-cols-2 items-center justify-center gap-4">
                <button className="borderbg-neutral-300 col-span-1 flex flex-row items-center justify-between space-x-2 rounded-md border bg-white px-3 py-2 shadow">
                    <span>{t("register")}</span>
                    <LuUserPlus />
                </button>
                <Link
                    className="col-span-1 flex flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-white shadow"
                    href="/app/"
                >
                    <span>{t("start")}</span>
                    <LuRocket />
                </Link>
            </div>
            <Image
                src="/boards-landing-bg.svg"
                alt="Background Image"
                className="pointer-events-none absolute right-0 bottom-0 z-0 m-0 h-full w-full object-cover opacity-70"
                unoptimized
                width={100}
                height={100}
                loading="eager"
            />
            <LanguageSelector localeChangeHandler={setLocale} />
        </main>
    );
}
