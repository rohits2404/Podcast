import { CreatePodcastForm } from "@/features/create-podcast/form";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const CreatePodcast = async () => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return <CreatePodcastForm />;
};

export default CreatePodcast;
