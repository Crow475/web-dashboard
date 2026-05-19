"use client";

import { authClient } from "@/lib/auth-client";

import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton({ title }: { title: string }) {
    return (
        <button
            className="flex h-min w-1/2 cursor-pointer flex-row items-center justify-center space-y-0 space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 shadow md:h-full md:flex-col md:justify-around md:space-x-0"
            onClick={() =>
                authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/app/",
                })
            }
            title={title}
        >
            <FcGoogle className="size-6 md:size-10" />
            <span className="text-base font-bold md:text-xl">Google</span>
        </button>
    );
}
