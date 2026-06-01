"use server";
import { headers } from "next/headers";

import { dataDB } from "@/db/drizzle";
import { profiles } from "@/db/data/schema";
import { ilike, and, ne } from "drizzle-orm";

import { auth } from "@/lib/auth";

export default async function searchProfile(search: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const result = await dataDB
        .select({
            profileId: profiles.profileId,
            username: profiles.username,
            icon: profiles.icon,
            publicEmail: profiles.publicEmail,
            userId: profiles.userId,
            preferences: profiles.preferences,
        })
        .from(profiles)
        .where(and(ilike(profiles.username, `%${search}%`), ne(profiles.userId, session.user.id)));

    return result;
}
