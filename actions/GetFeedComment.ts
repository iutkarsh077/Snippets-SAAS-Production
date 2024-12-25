"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function GetFeedComment(feedId: string) {
    revalidatePath("/feeds");
    try {
        const getAllComments = await prisma.feedsComment.findMany({
            where: {
                feedId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true
                    }
                },
                feed: {
                    select: {
                        authorId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' 
            },
        })

        console.log(getAllComments)
        return {msg: "Successfully get alll the comments", commentsData: getAllComments, status: true}
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}