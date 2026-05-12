import { useTranslations, useLocale } from "next-intl";

import setLocale from "@/lib/setLocale";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { notoColorEmoji } from "@/lib/fonts";

import DefaultHeader from "@/components/custom/defaultHeader";

import { LuSettings } from "react-icons/lu";

export default function Settings() {
    const t = useTranslations("settings");
    const locale = useLocale();

    console.log("Current locale:", locale);

    return (
        <main className="flex w-full flex-col items-center justify-start">
            <DefaultHeader title={t("title")} icon={<LuSettings size={32} />} />
            <ScrollArea className="flex h-[90vh] w-full flex-col items-start justify-start pr-4 md:w-3/4 md:px-10">
                <div className="flex w-full pt-10"></div>
                <div className="flex w-full flex-row items-center justify-between px-1">
                    <div className="flex flex-col items-start justify-start">
                        <label className="text-base font-bold md:text-lg" id="languageSelect">
                            {t("language.label")}
                        </label>
                        <p className="text-xs text-neutral-500 md:text-sm">{t("language.description")}</p>
                    </div>
                    <Select onValueChange={setLocale} defaultValue={locale}>
                        <SelectTrigger className="w-32 md:w-40" aria-labelledby="languageSelect">
                            <SelectValue className="text-sm md:text-base" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">
                                <span className={notoColorEmoji.className}>🇬🇧</span>
                                <span>English</span>
                            </SelectItem>
                            <SelectItem value="ru">
                                <span className={notoColorEmoji.className}>🇷🇺</span>
                                <span>Русский</span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator className="my-6" />
            </ScrollArea>
        </main>
    );
}
