import { drizzle } from "drizzle-orm/postgres-js";

export const dataDB = drizzle(process.env.DATABASE_DATA_URL!);
export const authDB = drizzle(process.env.DATABASE_AUTH_URL!);
