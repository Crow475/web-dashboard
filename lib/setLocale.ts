"use server";
import { cookies } from "next/headers";

export default async function setLocale(locale: string) {
    const cookieStore = await cookies();
    cookieStore.set("locale", locale);
}
