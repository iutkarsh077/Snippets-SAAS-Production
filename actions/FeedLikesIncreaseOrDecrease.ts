"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export async function FeedLikesIncreaseorDecrease(feedId: string) {
    revalidatePath("/feeds");
    try {

        // console.log("Feed id is: ", feedId);
        const userDetails = await GetUserDetails();

        if (!userDetails || !userDetails.decodeCookieValue) {
            return { msg: "Unauthorized access denied", status: false };
        }

        const findUserInLikeFeed = await prisma.feedsLikes.findFirst({
            where: {
                AND: [
                    { authorId: userDetails.decodeCookieValue?.id },
                    { feedId: feedId }
                ]
            }
        });
        // console.log(findUserInLikeFeed);

        if (!findUserInLikeFeed) {
            const likeTheFeed = await prisma.feedsLikes.create({
                data: {
                    feedId: feedId,
                    authorId: userDetails.decodeCookieValue.id
                }
            })
        }
        else {
            const removeLikeFeed = await prisma.feedsLikes.deleteMany({
                where: {
                    authorId: userDetails.decodeCookieValue?.id,
                    feedId: feedId
                }
            })
        }

        const getAllLikes = await prisma.feedsLikes.findMany({
            where: {
                feedId: feedId
            }
        });
        const data = {
            userId: userDetails.decodeCookieValue.id,
            likesCount: getAllLikes.length,
            getAllLikes
        }

        // console.log(data);

        return { msg: "Liked Successfully", data, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}