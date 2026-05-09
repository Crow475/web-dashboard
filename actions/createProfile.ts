"use server";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";

export async function createProfile(userId: string, username: string, icon: string) {
    // console.log("Creating profile for user:", { userId, username, icon });

    const result = dataDB.insert(profiles).values({
        username: username,
        icon: icon,
        userId: userId,
        preferences: "{}",
    });

    // console.log("Profile creation result:", result);

    return result;
}
