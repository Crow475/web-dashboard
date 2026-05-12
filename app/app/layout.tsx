import { headers } from "next/headers";
import { forbidden } from "next/navigation";

import { auth } from "@/lib/auth";

import getProfileOfUser from "@/actions/getProfileOfUser";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        forbidden();
    }

    const userId = session.user.id;
    const profile = await getProfileOfUser(userId);

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar profile={profile} />
            <div className="flex w-full flex-row items-start justify-start">
                <SidebarTrigger className="sticky top-0" />
                <div className="flex w-full">{children}</div>
            </div>
        </SidebarProvider>
    );
}
