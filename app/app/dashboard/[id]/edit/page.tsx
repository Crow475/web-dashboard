import { notFound, forbidden } from "next/navigation";
import { headers } from "next/headers";

import getDashboard from "@/actions/getDashboard";
import getProfileOfUser from "@/actions/getProfileOfUser";
import getUsersOfDashboard from "@/actions/getUsersOfDashboard";

import { auth } from "@/lib/auth";

import DashboardEditor from "@/components/custom/dashboardEditor";

export default async function DashboardEditPage({ params }: { params: { id: string } }) {
    const { id } = await params;

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

    const users = await getUsersOfDashboard(id);

    return <DashboardEditor dashboard={dashboard} users={users ?? []} />;
}
