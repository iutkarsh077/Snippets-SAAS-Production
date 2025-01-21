"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export async function GetLatestFeed() {
    revalidatePath("/feeds");
    try {
        const userDetails = await GetUserDetails();
        if (!userDetails) {
            return { msg: "Failed to get the Feeds", status: false };
        }

        const cachedValues = await redis.get("latestfeed");

        if (cachedValues) {
            return { msg: "Successfully got the feed", feedsData: cachedValues, status: true };
        }

        const getFeeds = await prisma.feeds.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        id: true,
                        profileImage: true
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        await redis.set("latestfeed", getFeeds);
        await redis.expire("latestfeed", 120);

        return { msg: "Successfully got the feed", feedsData: getFeeds, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}