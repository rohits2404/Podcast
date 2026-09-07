import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Voxora",
    description: "Generate Your Podcasts Using AI",
    icons: {
        icon: "/icons/logo.png",
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body className={manrope.className}>
                <ConvexClientProvider>{children}</ConvexClientProvider>
            </body>
        </html>
    );
}
