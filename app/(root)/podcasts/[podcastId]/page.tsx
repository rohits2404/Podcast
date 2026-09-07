import { Id } from "@/convex/_generated/dataModel";
import { PodcastDetails } from "@/features/podcasts";
import React from "react";

const PodcastDetailsPage = async ({
    params,
}: {
    params: Promise<{ podcastId: Id<"podcasts"> }>;
}) => {
    const { podcastId } = await params;

    return <PodcastDetails podcastId={podcastId} />;
};

export default PodcastDetailsPage;
