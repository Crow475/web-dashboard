import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { authDB } from "@/db/drizzle";

export const auth = betterAuth({
    database: drizzleAdapter(authDB, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        database: {
            generateId: () => crypto.randomUUID(),
        },
    },
});
