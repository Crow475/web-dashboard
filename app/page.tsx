import Link from "next/link";
import Image from "next/image";

import { useTranslations } from "next-intl";

import { LuRocket, LuUserPlus } from "react-icons/lu";

import { montserrat } from "@/lib/fonts";

import LanguageSelector from "@/components/custom/languageSelector";
import AboutLink from "@/components/custom/aboutLink";
import setLocale from "@/lib/setLocale";

export default function LandingPage() {
    const t = useTranslations("landing");

    return (
        <main className="static flex h-svh w-full flex-col items-center justify-start space-y-24 bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover px-10 py-40">
            <AboutLink />
            <div className="z-10 flex flex-col items-center justify-center">
                <h1 className={`text-7xl font-black select-none md:text-9xl ${montserrat.className}`}>{t("title")}</h1>
                <span className="text-[0.6rem] select-none md:text-base">{t("subtitle")}</span>
            </div>
            <div className="z-10 grid w-1/2 grid-cols-1 items-center justify-center gap-4 md:w-1/4 md:grid-cols-2">
                <Link
                    className="col-span-1 flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow hover:bg-neutral-100 md:text-base"
                    href="/sign-up"
                >
                    <span>{t("register")}</span>
                    <LuUserPlus />
                </Link>
                <Link
                    className="col-span-1 flex flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-sm text-white shadow hover:bg-blue-600 md:text-base"
                    href="/app/"
                >
                    <span>{t("start")}</span>
                    <LuRocket />
                </Link>
            </div>
            <Image
                src="/boards-landing-bg.svg"
                alt="Background Image"
                role="presentation"
                className="pointer-events-none absolute right-0 bottom-0 z-0 m-0 h-full w-2/3 object-cover opacity-70 md:w-full"
                unoptimized
                width={100}
                height={100}
                loading="eager"
            />
            <LanguageSelector localeChangeHandler={setLocale} />
        </main>
    );
}
