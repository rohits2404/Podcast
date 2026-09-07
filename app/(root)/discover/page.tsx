import { Discover } from "@/features/discover";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const DiscoverPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { search } = await searchParams;

    return <Discover searchParams={{ search }} />;
};

export default DiscoverPage;
