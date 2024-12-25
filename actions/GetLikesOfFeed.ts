"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export async function GetLikesOfFeed(feedId: string) {
    revalidatePath("/feeds");

    try {
        const userDetails = await GetUserDetails();

        if (!userDetails || !userDetails.decodeCookieValue) {
            return { msg: "Unauthorized access denied", status: false };
        }
        console.log(feedId)
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

        return { msg: "Liked Successfully", data, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}