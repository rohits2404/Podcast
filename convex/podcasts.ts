import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const createPodcast = mutation({
    args: {
        audioStorageId: v.id("_storage"),
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioUrl: v.string(),
        imageUrl: v.string(),
        imageStorageId: v.id("_storage"),
        voicePrompt: v.string(),
        imagePrompt: v.string(),
        voiceType: v.string(),
        views: v.number(),
        audioDuration: v.number(),
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("User Not Authenticated");
        }

        const clerkId = identity.subject;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("User Not Found");
        }

        return await ctx.db.insert("podcasts", {
            audioStorageId: args.audioStorageId,
            user: user._id,
            podcastTitle: args.podcastTitle,
            podcastDescription: args.podcastDescription,
            audioUrl: args.audioUrl,
            imageUrl: args.imageUrl,
            imageStorageId: args.imageStorageId,
            author: user.name,
            authorId: user.clerkId,
            voicePrompt: args.voicePrompt,
            imagePrompt: args.imagePrompt,
            voiceType: args.voiceType,
            views: args.views,
            authorImageUrl: user.imageUrl,
            audioDuration: args.audioDuration,
        });
    },
});

export const getTrendingPodcasts = query({
    handler: async (ctx) => {
        const podcast = await ctx.db.query("podcasts").collect();

        return podcast.sort((a, b) => b.views - a.views).slice(0, 8);
    },
});
