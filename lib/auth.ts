import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { authDB } from "@/db/drizzle";
import { user, session, account, verification } from "@/db/auth/schema";

export const auth = betterAuth({
    database: drizzleAdapter(authDB, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    advanced: {
        database: {
            generateId: () => crypto.randomUUID(),
        },
    },
    plugins: [nextCookies()],
});
