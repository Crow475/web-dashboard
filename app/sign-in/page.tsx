import Link from "next/link";
import Image from "next/image";

import { LuUserPlus } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";

import { useTranslations } from "next-intl";

import LanguageSelector from "@/components/custom/languageSelector";
import BackLink from "@/components/custom/backLink";
import AboutLink from "@/components/custom/aboutLink";
import SignInForm from "@/components/custom/signInForm";
import GithubSignInButton from "@/components/custom/githubSignInButton";

import setLocale from "@/lib/setLocale";

export default function SignInPage() {
    const t = useTranslations("signIn");

    return (
        <main className="flex h-svh w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <BackLink href="/" label={t("back")} />
            <AboutLink />
            <div className="z-10 flex h-7/12 w-[90%] grid-cols-2 grid-rows-2 flex-col gap-2 md:grid md:h-1/2 md:w-1/2">
                <div className="col-span-1 col-start-1 row-span-2 row-start-1 flex flex-col items-center justify-start space-y-4 rounded-lg border border-neutral-300 bg-white py-5 shadow md:py-10">
                    <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
                    <SignInForm />
                </div>
                <div className="col-span-1 col-start-2 row-span-1 row-start-2 flex w-full flex-col justify-between rounded-lg border border-neutral-200 bg-white px-4 py-4 shadow">
                    <h2 className="flex h-1/5 w-full flex-row items-center justify-start text-base font-semibold md:text-xl">
                        {t("or")}
                    </h2>
                    <div className="flex h-[70%] w-full flex-row items-center justify-center space-x-3">
                        <button className="flex h-min w-1/2 cursor-pointer flex-row items-center justify-center space-y-0 space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 shadow md:h-full md:flex-col md:justify-around md:space-x-0">
                            <FcGoogle className="size-6 md:size-10" />
                            <span className="text-base font-bold md:text-xl">Google</span>
                        </button>
                        <GithubSignInButton />
                    </div>
                </div>
                <div className="col-span-1 col-start-2 row-span-1 row-start-1 flex flex-col justify-between space-y-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow md:py-4 [@media(max-height:668px)]:flex-row [@media(max-height:668px)]:space-y-0">
                    <h2 className="flex h-auto w-full flex-row items-center justify-start text-base font-semibold md:h-1/5 md:text-xl">
                        {t("register")}
                    </h2>
                    <div className="flex flex-col items-start justify-start space-y-1 [@media(max-height:668px)]:hidden">
                        <span className="text-xs text-neutral-600 md:text-sm">{t("registerLine")}</span>
                        <ul className="flex list-disc flex-col items-start justify-start space-y-0.5 pl-5 text-xs text-neutral-600 md:text-sm">
                            <li>{t("registerPoint1")}</li>
                            <li>{t("registerPoint2")}</li>
                        </ul>
                    </div>
                    <div className="flex w-full flex-row items-center justify-end [@media(max-height:668px)]:w-[40%]">
                        <Link
                            href="/sign-up"
                            className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs shadow hover:bg-neutral-100 md:text-sm"
                        >
                            <span>{t("registerButton")}</span>
                            <LuUserPlus />
                        </Link>
                    </div>
                </div>
            </div>
            <LanguageSelector localeChangeHandler={setLocale} />
            <Image
                src="/squares.svg"
                alt="Background Image"
                role="presentation"
                className="pointer-events-none absolute right-0 bottom-0 z-0 m-0 h-full w-2/3 object-cover opacity-80 md:w-full"
                unoptimized
                width={100}
                height={100}
                loading="eager"
            />
        </main>
    );
}
