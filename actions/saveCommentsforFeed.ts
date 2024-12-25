"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { GetUserDetails } from "./GetUserDetails";

interface CommentData {
    text: string
    feedId: string;
  }

export async function SaveCommentForFeed(data: CommentData) {
    revalidatePath("/feeds");
    try {
        const { feedId, text } = data;
        if (!feedId || !text) {
            return { msg: "Fields are empty", status: false }
        }

        const userDetails = await GetUserDetails();

        if (!userDetails) {
            return { msg: "Unauthorized access denied", status: false };
        }

        const saveComment = await prisma.feedsComment.create({
            data: {
                feedId: feedId,
                authorId: userDetails.decodeCookieValue?.id,
                content: text
            },
            include: {
                author: {
                    select: {
                        username: true,
                        profileImage: true
                    }
                }
            }
        })


        // console.log(saveComment)
        return { msg: "Comment sent successfully", commentData: saveComment, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false }
    }
}