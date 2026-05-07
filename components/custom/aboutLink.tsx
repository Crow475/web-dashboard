import Link from "next/link";
import Image from "next/image";

import { useTranslations } from "next-intl";

export default function AboutLink() {
    const t = useTranslations("component.aboutLink");

    return (
        <div className="absolute top-0 right-0 z-10 flex flex-col items-center justify-center p-4">
            <Link className="" href="/about" title={t("title")}>
                <Image src="/brds_small.svg" alt="Logo" role="presentation" width={50} unoptimized height={50} />
            </Link>
        </div>
    );
}
