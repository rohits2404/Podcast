import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
    path: "/clerk",
    method: "POST",

    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error("CLERK_WEBHOOK_SECRET is missing");

            return new Response("Webhook secret is missing", {
                status: 500,
            });
        }

        const payload = await request.text();

        const svixHeaders = {
            "svix-id": request.headers.get("svix-id") ?? "",
            "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
            "svix-signature": request.headers.get("svix-signature") ?? "",
        };

        try {
            const wh = new Webhook(webhookSecret);

            const event = wh.verify(payload, svixHeaders) as {
                type: string;
                data: {
                    id?: string;
                    first_name?: string | null;
                    last_name?: string | null;
                    image_url?: string;
                    primary_email_address_id?: string | null;
                    email_addresses?: {
                        id: string;
                        email_address: string;
                    }[];
                };
            };

            console.log("CLERK EVENT:", event.type);

            if (!event.data.id) {
                return new Response("Missing user ID", {
                    status: 400,
                });
            }

            switch (event.type) {
                case "user.created": {
                    const primaryEmail = event.data.email_addresses?.find(
                        (email) =>
                            email.id === event.data.primary_email_address_id,
                    );

                    const email =
                        primaryEmail?.email_address ??
                        event.data.email_addresses?.[0]?.email_address ??
                        "";

                    const name =
                        [event.data.first_name, event.data.last_name]
                            .filter(Boolean)
                            .join(" ") || "Voxora User";

                    await ctx.runMutation(internal.users.createUser, {
                        clerkId: event.data.id,
                        email,
                        imageUrl: event.data.image_url ?? "",
                        name,
                    });

                    console.log("USER CREATED:", event.data.id);

                    break;
                }

                case "user.updated": {
                    const primaryEmail = event.data.email_addresses?.find(
                        (email) =>
                            email.id === event.data.primary_email_address_id,
                    );

                    const email =
                        primaryEmail?.email_address ??
                        event.data.email_addresses?.[0]?.email_address ??
                        "";

                    await ctx.runMutation(internal.users.updateUser, {
                        clerkId: event.data.id,
                        email,
                        imageUrl: event.data.image_url ?? "",
                    });

                    console.log("USER UPDATED:", event.data.id);

                    break;
                }

                case "user.deleted": {
                    await ctx.runMutation(internal.users.deleteUser, {
                        clerkId: event.data.id,
                    });

                    console.log("USER DELETED:", event.data.id);

                    break;
                }
            }

            return new Response("OK", {
                status: 200,
            });
        } catch (error) {
            console.error("WEBHOOK ERROR:", error);

            return new Response(
                error instanceof Error ? error.message : String(error),
                {
                    status: 400,
                },
            );
        }
    }),
});

export default http;
