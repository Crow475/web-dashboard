import { LuLayoutGrid } from "react-icons/lu";

import DashboardListItem from "@/components/custom/dashboardListItem";

export default function Home() {
    return (
        <main className="relative flex w-full flex-1 flex-col items-center justify-start">
            <header className="sticky top-0 flex w-[90%] flex-row items-center justify-start space-x-5 border-b border-neutral-300 bg-white px-5 py-4">
                <LuLayoutGrid size={32} />
                <h1 className="text-4xl font-semibold">Your dashboards</h1>
            </header>
            <div className="flex w-[90%] flex-col items-center justify-start">
                <div className="grid w-full grid-cols-2 gap-4 px-2 py-4">
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                    <DashboardListItem />
                </div>
            </div>
        </main>
    );
}
