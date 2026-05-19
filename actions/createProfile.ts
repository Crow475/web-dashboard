"use server";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";
import { eq } from "drizzle-orm";

export async function createProfile(userId: string, username: string, icon: string) {
    console.log("Creating profile for user:", { userId, username, icon });

    const existingProfile = await dataDB.select().from(profiles).where(eq(profiles.userId, userId));
    if (existingProfile.length > 0) {
        console.log("Profile already exists:", existingProfile[0]);
        return;
    }

    const result = dataDB.insert(profiles).values({
        username: username,
        icon: icon,
        userId: userId,
        preferences: "{}",
    });

    console.log("Profile creation result:", result);

    return result;
}
