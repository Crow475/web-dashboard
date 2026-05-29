"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";
import { eq } from "drizzle-orm";

export async function deleteProfile(userId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const result = await dataDB
        .delete(profiles)
        .where(eq(profiles.userId, userId))
        .returning({ deletedId: profiles.profileId });

    return result[0];
}
