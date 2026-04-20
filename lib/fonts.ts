import { Noto_Color_Emoji } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";

export const notoColorEmoji = Noto_Color_Emoji({
    subsets: ["emoji"],
    weight: "400",
});

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin", "latin-ext", "cyrillic"],
});

export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin", "latin-ext", "cyrillic"],
});

export const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin", "latin-ext", "cyrillic"],
});
