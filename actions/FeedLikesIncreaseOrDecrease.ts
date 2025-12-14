"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export async function FeedLikesIncreaseorDecrease(feedId: string, liked: boolean) {
    revalidatePath("/feeds");
    try {

        // console.log("Feed id is: ", feedId);
        const userDetails = await GetUserDetails();

        if (!userDetails || !userDetails.decodeCookieValue) {
            return { msg: "Unauthorized access denied", status: false };
        }

        const field = `${feedId}:${userDetails.decodeCookieValue?.id}`

        // const reaction = await redis.hget("feed:reactions", field)
        const redisResponse = await redis.hset("feed:reactions", 
            liked === true ? {[field]: "disliked"} : {[field]: "liked"}
        )

        console.log("feed in redis: ", redisResponse)

        // const findUserInLikeFeed = await prisma.feedsLikes.findFirst({
        //     where: {
        //         AND: [
        //             { authorId: userDetails.decodeCookieValue?.id },
        //             { feedId: feedId }
        //         ]
        //     }
        // });
        // console.log(findUserInLikeFeed);

        // if (!findUserInLikeFeed) {
        //     const likeTheFeed = await prisma.feedsLikes.create({
        //         data: {
        //             feedId: feedId,
        //             authorId: userDetails.decodeCookieValue.id
        //         }
        //     })
        // }
        // else {
        //     const removeLikeFeed = await prisma.feedsLikes.deleteMany({
        //         where: {
        //             authorId: userDetails.decodeCookieValue?.id,
        //             feedId: feedId
        //         }
        //     })
        // }

        // const getAllLikes = await prisma.feedsLikes.findMany({
        //     where: {
        //         feedId: feedId
        //     }
        // });
        // const data = {
        //     userId: userDetails.decodeCookieValue.id,
        //     likesCount: getAllLikes.length + 1,
        //     getAllLikes
        // }

        // console.log(data);

        return { msg: "Liked Successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}