"use client";

import { authClient } from "@/lib/auth-client";

import { FaGithub } from "react-icons/fa";

export default function GithubSignInButton() {
    return (
        <button
            className="flex h-min w-1/2 cursor-pointer flex-row items-center justify-center space-y-0 space-x-2 rounded-md border border-black bg-black px-3 py-2 text-white shadow md:h-full md:flex-col md:justify-around md:space-x-0"
            onClick={() =>
                authClient.signIn.social({
                    provider: "github",
                    callbackURL: "/app/",
                })
            }
        >
            <FaGithub className="size-6 text-white md:size-10" />
            <span className="text-base font-bold md:text-xl">GitHub</span>
        </button>
    );
}
