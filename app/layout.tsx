import type { Metadata } from "next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

import { geistSans } from "@/lib/fonts";

export const metadata: Metadata = {
    title: "Boards",
    description: "Business-Oriented Aggregator of Disparate Systems and Data",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.className} h-svh antialiased`}>
            <body className="w-full">
                <NextIntlClientProvider>
                    {children}
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
