"use server";

import { notFound, forbidden } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import getProfileOfUser from "@/actions/getProfileOfUser";
import getDashboard from "@/actions/getDashboard";
import getRoleInDashboard from "@/actions/getRoleInDashboard";

import DashboardContextProvider from "@/components/dashboardContext";

export default async function DashboardLayout(props: LayoutProps<"/app/dashboard/[id]">) {
    const { id } = await props.params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        forbidden();
    }

    const profile = await getProfileOfUser(session.user.id);

    if (!profile) {
        forbidden();
    }

    const dashboard = await getDashboard(id, profile.profileId);

    if (!dashboard) {
        notFound();
    }

    const role = await getRoleInDashboard(dashboard.dashboardId, profile.profileId);

    return (
        <DashboardContextProvider dashboard={dashboard} role={role} profile={profile}>
            {props.children}
        </DashboardContextProvider>
    );
}
