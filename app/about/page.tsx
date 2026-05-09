import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { montserrat } from "@/lib/fonts";

import BackLink from "@/components/custom/backLink";
import LanguageSelector from "@/components/custom/languageSelector";

import setLocale from "@/lib/setLocale";

export default function About() {
    const t = useTranslations("about");

    return (
        <main className="relative flex w-full flex-col items-center justify-start">
            <BackLink href="/" label={t("back")} />
            <LanguageSelector localeChangeHandler={setLocale} />
            <header className="relative flex w-full flex-row items-center justify-start bg-linear-to-tr from-teal-500 from-5% via-blue-500 via-35% to-blue-300 px-10 pt-24 pb-4 md:px-20 md:pt-36">
                <h1 className={`z-10 mb-2 text-5xl font-black md:mb-4 md:text-7xl ${montserrat.className}`}>
                    {t("title")}
                </h1>
                <Image
                    src="/boards-landing-bg.svg"
                    alt="Background Image"
                    role="presentation"
                    className="pointer-events-none absolute right-0 bottom-0 z-0 m-0 h-full w-2/3 bg-local object-cover opacity-70 md:w-full"
                    unoptimized
                    width={100}
                    height={100}
                    loading="eager"
                />
            </header>
            <div className="my-8 flex flex-col space-y-10 divide-y-2 divide-neutral-200 px-10 md:my-16 md:px-28">
                <section className="flex w-full flex-col items-center justify-around space-y-8 py-14 md:flex-row md:space-y-0 md:py-20">
                    <Image
                        src="/about/paragraph1.svg"
                        role="presentation"
                        alt="Paragraph 1 Image"
                        className="w-full md:w-1/4"
                        unoptimized
                        width={50}
                        height={50}
                    />
                    <div className="flex w-full flex-col items-start justify-start space-y-4 md:w-1/3">
                        <h2 className="text-2xl font-bold">{t("heading1")}</h2>
                        <p className="text-lg">{t("paragraph1")}</p>
                    </div>
                </section>
                <section className="flex w-full flex-col-reverse items-center justify-around space-y-8 py-14 md:flex-row md:space-y-0 md:py-20">
                    <div className="flex w-full flex-col items-start justify-start space-y-4 md:w-1/3">
                        <h2 className="text-2xl font-bold">{t("heading2")}</h2>
                        <p className="text-lg">{t("paragraph2")}</p>
                    </div>
                    <Image
                        src="/about/paragraph2.svg"
                        role="presentation"
                        alt="Paragraph 2 Image"
                        className="w-full md:w-1/4"
                        unoptimized
                        width={50}
                        height={50}
                    />
                </section>
                <section className="flex w-full flex-col items-center justify-around space-y-8 py-14 md:flex-row md:space-y-0 md:py-20">
                    <Image
                        src="/about/paragraph3.svg"
                        role="presentation"
                        alt="Paragraph 3 Image"
                        className="w-full md:w-1/4"
                        unoptimized
                        width={50}
                        height={50}
                    />
                    <div className="flex w-full flex-col items-start justify-start space-y-4 md:w-1/3">
                        <h2 className="text-2xl font-bold">{t("heading3")}</h2>
                        <p className="text-xl">{t("paragraph3")}</p>
                    </div>
                </section>
            </div>
            <footer className="mt-10 mb-30 flex w-[70%] flex-row items-center justify-between rounded-lg border border-neutral-200 bg-white px-20 py-10 shadow">
                <Image
                    src="brds_small.svg"
                    alt="Footer Image"
                    className="h-20 w-20"
                    unoptimized
                    width={50}
                    height={50}
                />
                <span className="text-sm text-neutral-500">© 2026 BOARDS. {t("ARR")}</span>
                <div className="flex flex-col items-start justify-center space-y-2 font-bold">
                    <Link href="/" className="text-sm text-blue-500 hover:underline">
                        {t("home")}
                    </Link>
                    <Link href="/sign-in" className="text-sm text-blue-500 hover:underline">
                        {t("signIn")}
                    </Link>
                    <Link href="/sign-up" className="text-sm text-blue-500 hover:underline">
                        {t("signUp")}
                    </Link>
                </div>
            </footer>
        </main>
    );
}
