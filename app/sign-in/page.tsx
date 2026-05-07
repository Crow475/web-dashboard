import Link from "next/link";
import Image from "next/image";

import { LuMoveLeft, LuUserPlus } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { useTranslations } from "next-intl";

import LanguageSelector from "@/components/custom/languageSelector";
import SignInForm from "@/components/custom/signInForm";

import setLocale from "@/lib/setLocale";

export default function SignInPage() {
    const t = useTranslations("signIn");

    return (
        <main className="flex h-screen w-full flex-col items-center justify-center bg-linear-to-t from-blue-400 via-blue-300 via-10% to-white to-40% bg-cover">
            <Link
                href="/"
                className="absolute top-5 left-5 z-10 flex flex-row items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow hover:bg-neutral-100"
            >
                <LuMoveLeft />
                <span>{t("back")}</span>
            </Link>
            <div className="z-10 grid h-1/2 w-1/2 grid-cols-2 grid-rows-2 gap-2">
                <div className="col-span-1 col-start-2 row-span-1 row-start-1 flex flex-col space-y-1 rounded-lg border border-neutral-200 bg-white px-4 py-4 shadow">
                    <h2 className="flex h-1/5 w-full flex-row items-center justify-start text-xl font-semibold">
                        {t("register")}
                    </h2>
                    <div className="flex flex-col items-start justify-start space-y-1">
                        <span className="text-sm text-neutral-600">{t("registerLine")}</span>
                        <ul className="flex list-disc flex-col items-start justify-start space-y-0.5 pl-5 text-sm text-neutral-600">
                            <li>{t("registerPoint1")}</li>
                            <li>{t("registerPoint2")}</li>
                        </ul>
                    </div>
                    <div className="flex w-full flex-row items-center justify-end">
                        <Link
                            href="/sign-up"
                            className="flex cursor-pointer flex-row items-center justify-between space-x-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow hover:bg-neutral-100"
                        >
                            <span>{t("registerButton")}</span>
                            <LuUserPlus />
                        </Link>
                    </div>
                </div>
                <div className="col-span-1 col-start-2 row-span-1 row-start-2 flex flex-col justify-between rounded-lg border border-neutral-200 bg-white px-4 py-4 shadow">
                    <h2 className="flex h-1/5 w-full flex-row items-center justify-start text-xl font-semibold">
                        {t("or")}
                    </h2>
                    <div className="flex h-[70%] w-full flex-row items-center justify-center space-x-3">
                        <button className="flex h-full w-1/2 cursor-pointer flex-col items-center justify-around space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 shadow">
                            <FcGoogle className="size-10" />
                            <span className="text-xl font-bold">Google</span>
                        </button>
                        <button className="flex h-full w-1/2 cursor-pointer flex-col items-center justify-around space-x-2 rounded-md border border-black bg-black px-3 py-2 text-white shadow">
                            <FaGithub className="size-10 text-white" />
                            <span className="text-xl font-bold">GitHub</span>
                        </button>
                    </div>
                </div>
                <div className="col-span-1 col-start-1 row-span-2 row-start-1 flex flex-col items-center justify-start space-y-4 rounded-lg border border-neutral-300 bg-white py-10 shadow">
                    <h1 className="text-3xl font-bold">{t("title")}</h1>
                    <SignInForm />
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
