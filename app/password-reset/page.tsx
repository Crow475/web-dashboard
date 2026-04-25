import Link from "next/link";

import { useTranslations } from "next-intl";

import { LuMoveLeft, LuMail, LuSend } from "react-icons/lu";

import LanguageSelector from "@/components/custom/languageSelector";
import setLocale from "@/lib/setLocale";

export default function ResetPasswordPage() {
    const t = useTranslations("resetPassword");

    return (
        <main className="flex h-screen w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <Link
                href="/sign-in"
                className="absolute top-5 left-5 z-10 flex flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow"
            >
                <LuMoveLeft />
                <span>{t("back")}</span>
            </Link>
            <div className="z-10 flex h-5/12 w-1/4 flex-col items-center rounded-lg border border-neutral-200 bg-white px-4 py-6 shadow">
                <h1 className="text-3xl font-bold">{t("title")}</h1>
                <form className="flex h-full w-[80%] flex-col items-center justify-between pt-5">
                    <div className="flex h-full w-full flex-col items-center justify-between space-y-2">
                        <div className="flex w-full flex-col items-start justify-start space-y-1">
                            <label htmlFor="email" className="mr-2 text-sm text-neutral-600">
                                {t("email")}
                            </label>
                            <label
                                className="flex w-full flex-row items-center justify-start rounded-sm border border-neutral-200 px-2 shadow focus-within:border-blue-500"
                                htmlFor="email"
                            >
                                <div className="flex w-[10%] text-neutral-400">
                                    <LuMail />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="flex w-[90%] py-1 focus:outline-0"
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400">{t("resetText")}</p>
                        </div>
                        <div className="mt-6 flex w-full flex-row items-center justify-center">
                            <button
                                type="submit"
                                className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-blue-400 bg-blue-500 px-3 py-2 text-sm text-white shadow hover:bg-blue-600"
                            >
                                <span>{t("submit")}</span>
                                <LuSend />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <LanguageSelector localeChangeHandler={setLocale} />
        </main>
    );
}
