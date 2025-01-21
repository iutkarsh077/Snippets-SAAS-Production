"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export async function DeleteFeed(feedId: string) {
    revalidatePath("/feeds");
    try {
        const deleteFeed = await prisma.feeds.delete({
            where: {
                id: feedId
            }
        })

        await redis.del("latestfeed");
        return { msg: "Successfully deleted the feed", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}