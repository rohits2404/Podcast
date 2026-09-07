import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function Page() {
    return (
        <div className="flex-center glassmorphism-auth h-screen w-full">
            <SignIn />
        </div>
    );
}
