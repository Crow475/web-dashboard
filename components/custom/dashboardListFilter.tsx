"use client";

import { useRouter } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { LuFilter } from "react-icons/lu";

import { useTranslations } from "next-intl";

export default function DashboardListFilter({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();

    const t = useTranslations("component.dashboardListFilter");

    return (
        <div className="flex flex-row items-center justify-start space-x-2">
            <LuFilter className="size-4 text-neutral-500" />
            <span className="sr-only">Filter</span>
            <Select
                defaultValue={defaultValue}
                onValueChange={(value) => {
                    router.push(`/app?type=${value}`);
                }}
            >
                <SelectTrigger className="w-30 text-xs text-neutral-600 shadow">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs text-neutral-600">
                    <SelectItem value="all">{t("all")}</SelectItem>
                    <SelectItem value="owned">{t("owned")}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
