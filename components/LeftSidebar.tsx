"use client";

import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useAudio } from "@/providers/AudioProvider";

export const LeftSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const { isSignedIn } = useAuth();
    const { signOut } = useClerk();

    const { audio } = useAudio();

    return (
        <section
            className={cn("left_sidebar h-[calc(100vh-5px)]", {
                "h-[calc(100vh-116px)]": audio?.audioUrl,
            })}
        >
            <nav className="flex flex-col gap-6">
                <Link
                    href="/"
                    className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
                >
                    <Image
                        src="/icons/logo.png"
                        alt="logo"
                        width={23}
                        height={27}
                    />

                    <h1 className="text-24 font-extrabold text-white max-lg:hidden">
                        Voxora
                    </h1>
                </Link>

                {sidebarLinks.map(({ route, label, imgURL }) => {
                    const isActive =
                        pathname === route || pathname.startsWith(`${route}/`);

                    return (
                        <Link
                            href={route}
                            key={label}
                            className={cn(
                                "flex items-center justify-center gap-3 py-4 max-lg:px-4 lg:justify-start",
                                {
                                    "border-r-4 border-orange-1 bg-nav-focus":
                                        isActive,
                                },
                            )}
                        >
                            <Image
                                src={imgURL}
                                alt={label}
                                width={24}
                                height={24}
                            />

                            <p>{label}</p>
                        </Link>
                    );
                })}
            </nav>

            <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                {isSignedIn ? (
                    <Button
                        className="text-16 w-full bg-orange-1 font-extrabold"
                        onClick={() => signOut(() => router.push("/sign-in"))}
                    >
                        Log Out
                    </Button>
                ) : (
                    <Button
                        asChild
                        className="text-16 w-full bg-orange-1 font-extrabold"
                    >
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                )}
            </div>
        </section>
    );
};
