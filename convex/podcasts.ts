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

// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
export const getPodcastByVoiceType = query({
    args: {
        podcastId: v.id("podcasts"),
    },
    handler: async (ctx, args) => {
        const podcast = await ctx.db.get(args.podcastId);

        return await ctx.db
            .query("podcasts")
            .filter((q) =>
                q.and(
                    q.eq(q.field("voiceType"), podcast?.voiceType),
                    q.neq(q.field("_id"), args.podcastId),
                ),
            )
            .collect();
    },
});

// this query will get the podcast by the podcastId.
export const getPodcastById = query({
    args: {
        podcastId: v.id("podcasts"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.podcastId);
    },
});

// this mutation will delete the podcast.
export const deletePodcast = mutation({
    args: {
        podcastId: v.id("podcasts"),
        imageStorageId: v.id("_storage"),
        audioStorageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const podcast = await ctx.db.get(args.podcastId);

        if (!podcast) {
            throw new ConvexError("Podcast Not Found");
        }

        await ctx.storage.delete(args.imageStorageId);
        await ctx.storage.delete(args.audioStorageId);
        return await ctx.db.delete(args.podcastId);
    },
});
