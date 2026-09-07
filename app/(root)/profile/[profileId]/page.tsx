import { Profile } from "@/features/profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async ({
    params,
}: {
    params: Promise<{
        profileId: string;
    }>;
}) => {
    const { profileId } = await params;

    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return <Profile profileId={profileId} />;
};

export default ProfilePage;
