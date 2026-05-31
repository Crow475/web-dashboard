import { ScrollArea } from "@/components/ui/scroll-area";

import DefaultHeader from "@/components/custom/defaultHeader";

import { LuUserSearch, LuCircleOff } from "react-icons/lu";

import type { profileSelectReturn } from "@/lib/types";
import searchProfile from "@/actions/searchProfile";

import { getTranslations } from "next-intl/server";

import Searchbar from "@/components/custom/searchbar";
import UserSearchCard from "@/components/custom/userSearchCard";

export default async function Search({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const search = await searchParams;
    const query = search.query as string;

    const t = await getTranslations("search");

    const users: profileSelectReturn[] = query ? ((await searchProfile(query)) ?? []) : [];

    return (
        <main className="flex w-full flex-col items-center justify-start">
            <DefaultHeader title={t("title")} icon={<LuUserSearch size={32} />} />
            <Searchbar
                defaultValue={(search.query as string) ?? ""}
                placeholder={t("placeholder")}
                buttonText={t("search")}
            />
            <ScrollArea className="flex h-[78svh] w-full flex-col items-start justify-start pr-4 md:w-3/4 md:px-10">
                <div className="flex w-full flex-col items-center justify-start space-y-2 px-2">
                    {!query ? (
                        <></>
                    ) : users.length === 0 ? (
                        <div className="flex h-[75vh] w-full flex-col items-center justify-center space-y-4 rounded-2xl bg-neutral-50">
                            <LuCircleOff className="size-15 text-neutral-400 md:size-20" />
                            <span className="text-center text-lg text-neutral-600">
                                {t("noResults")} <span className="font-semibold">{query}</span>
                            </span>
                        </div>
                    ) : (
                        users.map((user) => <UserSearchCard key={user.profileId} user={user} />)
                    )}
                </div>
            </ScrollArea>
        </main>
    );
}
