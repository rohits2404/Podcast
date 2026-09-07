import { Home } from "@/features/home";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = async () => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return <Home />;
};

export default HomePage;
