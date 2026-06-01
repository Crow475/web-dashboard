"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import getProfileOfUser from "@/actions/getProfileOfUser";
import getProfileById from "@/actions/getProfileById";
import getDashboard from "@/actions/getDashboard";
import getRoleInDashboard from "@/actions/getRoleInDashboard";
import getUsersOfDashboard from "@/actions/getUsersOfDashboard";
import updateDashboardUsers from "@/actions/updateDashboardUsers";

import uuidToShort from "@/lib/uuidToShort";

export default async function addUserToDashboard(
    dashboardId: string,
    profileId: string,
    role: "viewer" | "editor" | "admin",
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const initiatorProfile = await getProfileOfUser(session.user.id);
    if (!initiatorProfile) {
        return null;
    }

    const dashboard = await getDashboard(uuidToShort(dashboardId), initiatorProfile.profileId);
    if (!dashboard) {
        return null;
    }

    const roleOfInitiator = await getRoleInDashboard(dashboardId, initiatorProfile.profileId);
    const initiatorIsOwner = initiatorProfile.profileId === dashboard.ownerId;

    if ((!roleOfInitiator && !initiatorIsOwner) || (!initiatorIsOwner && roleOfInitiator !== "admin")) {
        return null;
    }

    const profile = await getProfileById(uuidToShort(profileId));

    if (!profile) {
        return null;
    }

    const users = await getUsersOfDashboard(uuidToShort(dashboardId));

    if (!users) {
        return null;
    }

    const userAlreadyExists = users.find((user) => user.profile?.profileId === profileId);

    if (userAlreadyExists) {
        return null;
    }

    console.log("Adding user to dashboard");
    console.log("Profile:", profile);
    console.log("Users:", users);
    console.log("Role:", role);
    console.log("Dashboard:", dashboard);

    const result = await updateDashboardUsers(dashboardId, [
        {
            profile: {
                profileId: profileId,
                username: profile.username,
                icon: profile.icon,
                publicEmail: profile.publicEmail,
                userId: profile.userId,
                preferences: profile.preferences,
            },
            role: role,
            dashboardId: dashboardId,
        },
        ...users,
    ]);

    console.log("Result:", result);

    return result;
}
