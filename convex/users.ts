import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        name: v.string(),
    },

    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            return;
        }

        await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            imageUrl: args.imageUrl,
            name: args.name,
        });
    },
});

export const updateUser = internalMutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    },

    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("User Not Found");
        }

        await ctx.db.patch(user._id, {
            email: args.email,
            imageUrl: args.imageUrl,
        });

        const podcasts = await ctx.db
            .query("podcasts")
            .filter((q) => q.eq(q.field("authorId"), args.clerkId))
            .collect();

        await Promise.all(
            podcasts.map((podcast) =>
                ctx.db.patch(podcast._id, {
                    authorImageUrl: args.imageUrl,
                }),
            ),
        );
    },
});

export const deleteUser = internalMutation({
    args: {
        clerkId: v.string(),
    },

    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (!user) {
            return;
        }

        await ctx.db.delete(user._id);
    },
});
