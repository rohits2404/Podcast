import { Id } from "@/convex/_generated/dataModel";
import { PodcastDetails } from "@/features/podcasts";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const PodcastDetailsPage = async ({
    params,
}: {
    params: Promise<{ podcastId: Id<"podcasts"> }>;
}) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { podcastId } = await params;

    return <PodcastDetails podcastId={podcastId} />;
};

export default PodcastDetailsPage;
