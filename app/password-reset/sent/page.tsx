import { useTranslations } from "next-intl";

import AboutLink from "@/components/custom/aboutLink";
import LanguageSelector from "@/components/custom/languageSelector";
import setLocale from "@/lib/setLocale";

import { LuCircleCheck } from "react-icons/lu";

export default function PasswordResetSentPage() {
    const t = useTranslations("resetSent");

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <AboutLink />
            <div className="z-10 flex h-5/12 w-[90%] flex-col items-center rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow md:w-1/4">
                <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
                <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
                    <LuCircleCheck className="size-10 text-neutral-500" />
                    <p className="text-center text-neutral-500">{t("sentText")}</p>
                </div>
            </div>
            <LanguageSelector localeChangeHandler={setLocale} />
        </main>
    );
}
