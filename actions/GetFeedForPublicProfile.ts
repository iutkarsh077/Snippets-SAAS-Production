"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export async function GetFeedForPublicProfile(username: string){
    revalidatePath("/feeds");
    try {
        const userDetails = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
        if(!userDetails){
            return { msg: "Failed to get the Feeds", status: false };
        }

        const getFeeds = await prisma.feeds.findMany({
            where: {
                authorId: userDetails?.id
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
            orderBy: {
                createdAt: "desc"
            }
        })
        // console.log(getFeeds);
        return { msg: "Successfully got the feed", feedsData: getFeeds ,status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}