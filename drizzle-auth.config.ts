import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle/auth",
    schema: "./db/auth/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_AUTH_URL!,
    },
});
