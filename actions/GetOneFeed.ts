"use server";
import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export async function GetOneFeed(feedId: string) {
    revalidatePath("/feeds");

    try {
        const userDetails = await GetUserDetails();
        if (!userDetails) {
            return { msg: "Failed to get the Feeds", status: false };
        }

        const getOneFeed = await prisma.feeds.findUnique({
            where: {
                id: feedId
            },

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
        })
        console.log(getOneFeed)
        return {msg: "Successfully got the feed", data: getOneFeed, status: true};
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}