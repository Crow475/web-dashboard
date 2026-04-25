import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle/data",
    schema: "./db/data/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_DATA_URL!,
    },
});
