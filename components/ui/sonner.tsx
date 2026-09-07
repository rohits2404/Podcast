"use client";

import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            toastOptions={{
                classNames: {
                    toast: "!border-orange-1 !bg-orange-1 !text-white-1",

                    success:
                        "!border-orange-1 !bg-orange-1 !text-white-1 [&>svg]:!text-white-1",

                    error: "!border-orange-1 !bg-orange-1 !text-white-1 [&>svg]:!text-white-1",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
