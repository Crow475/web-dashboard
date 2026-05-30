import { createAuthClient } from "better-auth/react";
import { lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
    plugins: [lastLoginMethodClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
