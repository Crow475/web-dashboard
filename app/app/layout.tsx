import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/appSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="flex w-full flex-row items-start justify-start">
                <SidebarTrigger className="sticky top-0" />
                <div className="flex w-full">{children}</div>
            </main>
        </SidebarProvider>
    );
}
