import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Bazaar Style | E-commerce de Luxe",
    description: "Découvrez notre collection exclusive de soins et beautés.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
