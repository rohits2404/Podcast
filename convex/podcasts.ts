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

// this query will get the podcast by the search query.
export const getPodcastBySearch = query({
    args: {
        search: v.string(),
    },
    handler: async (ctx, args) => {
        if (args.search === "") {
            return await ctx.db.query("podcasts").order("desc").collect();
        }

        const authorSearch = await ctx.db
            .query("podcasts")
            .withSearchIndex("search_author", (q) =>
                q.search("author", args.search),
            )
            .take(10);

        if (authorSearch.length > 0) {
            return authorSearch;
        }

        const titleSearch = await ctx.db
            .query("podcasts")
            .withSearchIndex("search_title", (q) =>
                q.search("podcastTitle", args.search),
            )
            .take(10);

        if (titleSearch.length > 0) {
            return titleSearch;
        }

        return await ctx.db
            .query("podcasts")
            .withSearchIndex("search_body", (q) =>
                q.search("podcastDescription", args.search),
            )
            .take(10);
    },
});

// this query will get the podcast by the authorId.
export const getPodcastByAuthorId = query({
    args: {
        authorId: v.string(),
    },
    handler: async (ctx, args) => {
        const podcasts = await ctx.db
            .query("podcasts")
            .filter((q) => q.eq(q.field("authorId"), args.authorId))
            .collect();

        const totalListeners = podcasts.reduce(
            (sum, podcast) => sum + podcast.views,
            0,
        );

        return { podcasts, listeners: totalListeners };
    },
});
