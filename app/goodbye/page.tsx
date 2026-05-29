import { notoColorEmoji } from "@/lib/fonts";

import BackLink from "@/components/custom/backLink";
import LanguageSelector from "@/components/custom/languageSelector";
import AboutLink from "@/components/custom/aboutLink";

import setLocale from "@/lib/setLocale";

import { useTranslations } from "next-intl";

export default function Goodbye() {
    const t = useTranslations("goodbye");

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-orange-300 via-amber-200 via-10% to-white to-40% bg-cover">
            <BackLink href="/" label={t("back")} />
            <AboutLink />
            <div className="z-10 flex h-auto w-[90%] flex-col items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow md:w-1/4">
                <div className="flex w-full flex-col items-center justify-center space-y-2 py-4">
                    <span className={`${notoColorEmoji.className} text-4xl`}>😿</span>
                    <h1 className="text-3xl font-bold">{t("title")}</h1>
                </div>
                <div className="flex w-full flex-col items-center justify-center space-y-3 px-2 py-4">
                    <p className="text-sm text-neutral-500">{t("paragraph1")}</p>
                    <p className="text-sm text-neutral-500">{t("paragraph2")}</p>
                </div>
            </div>
            <LanguageSelector localeChangeHandler={setLocale} />
        </main>
    );
}
