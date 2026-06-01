import type { dashboardFullSelectReturn } from "@/lib/types";

import { notoColorEmoji } from "@/lib/fonts";

import { LuCheck } from "react-icons/lu";

export default function DashboardInviteListItem({
    dashboard,
    selectedDashboard,
    setSelectedDashboard,
}: {
    dashboard: dashboardFullSelectReturn[0];
    selectedDashboard: dashboardFullSelectReturn[0] | null;
    setSelectedDashboard: (dashboard: dashboardFullSelectReturn[0] | null) => void;
}) {
    const isSelected = selectedDashboard?.dashboardId === dashboard.dashboardId;

    return (
        <button
            className="flex w-full flex-row items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 shadow"
            onClick={() => setSelectedDashboard(dashboard)}
        >
            <div className="flex flex-row items-center justify-start space-x-2">
                <span className={`${notoColorEmoji.className} text-2xl`}>{dashboard.icon}</span>
                <div className="flex flex-col items-start justify-start">
                    <div className="line-clamp-1 text-base font-semibold md:text-lg">{dashboard.title}</div>
                    <span className="text-xs text-neutral-500">{dashboard.owner.username}</span>
                </div>
            </div>
            <div
                className={`flex flex-row items-center justify-center rounded-full border p-0.5 ${isSelected ? "border-blue-200 bg-blue-500" : "border-neutral-200 bg-neutral-50"} `}
            >
                <LuCheck className={`${isSelected ? "opacity-100" : "opacity-0"} size-4 text-white`} />
            </div>
        </button>
    );
}
