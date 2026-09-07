import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexClientProvider";

const manrope = Manrope({
    subsets: ["latin"],
});

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
                <ClerkProvider
                    appearance={{
                        options: {
                            socialButtonsVariant: "iconButton",
                            logoImageUrl: "/icons/auth-logo.svg",
                            logoPlacement: "inside",
                        },

                        variables: {
                            colorPrimary: "#F97535",
                            colorPrimaryForeground: "#FFFFFF",

                            colorBackground: "#15171C",
                            colorForeground: "#FFFFFF",
                            colorMutedForeground: "#71788B",

                            colorInput: "#1B1F29",
                            colorInputForeground: "#FFFFFF",

                            colorBorder: "#2E3036",
                            colorRing: "#F97535",
                        },
                    }}
                >
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
