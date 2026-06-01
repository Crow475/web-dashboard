import { headers } from "next/headers";
import { forbidden } from "next/navigation";

import { auth } from "@/lib/auth";

import getProfileOfUser from "@/actions/getProfileOfUser";

import type { pinnedSelectReturn } from "@/lib/types";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSidebar";

import getPinned from "@/actions/getPinned";
import getLastOpened from "@/actions/getLastOpened";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        forbidden();
    }

    const userId = session.user.id;
    const profile = await getProfileOfUser(userId);

    const pinned = await getPinned();
    const lastOpened: pinnedSelectReturn[0] | null = await getLastOpened();

    console.log("Pinned:", pinned);

    if (!pinned) {
        forbidden();
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar profile={profile} pinned={pinned} lastOpened={lastOpened} />
            <div className="flex w-full flex-row items-start justify-start">
                <SidebarTrigger className="sticky top-0" />
                <div className="flex w-full">{children}</div>
            </div>
        </SidebarProvider>
    );
}
