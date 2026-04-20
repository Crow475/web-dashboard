import { useTranslations } from "next-intl";

import { LuLayoutGrid } from "react-icons/lu";

import DashboardListItem from "@/components/custom/dashboardListItem";
import DefaultHeader from "@/components/custom/defaultHeader";

export default function Home() {
    const t = useTranslations("home");

    return (
        <main className="relative flex w-full flex-1 flex-col items-center justify-start">
            <DefaultHeader title={t("title")} icon={<LuLayoutGrid size={32} />} />
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
