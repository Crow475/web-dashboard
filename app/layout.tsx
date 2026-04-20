import type { Metadata } from "next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";

import { geistSans } from "@/lib/fonts";

export const metadata: Metadata = {
    title: "BOARDS",
    description: "Business-Oriented Aggregator of Disparate Systems and Data",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.className} h-full antialiased`}>
            <body className="w-screen">
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </body>
        </html>
    );
}
