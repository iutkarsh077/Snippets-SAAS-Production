"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function DeleteFeedComment(commentId: string) {
    revalidatePath("/feeds");

    try {
        const deleteComment = await prisma.feedsComment.delete({
            where: {
                id: commentId
            }
        })
        console.log(deleteComment)
        return { msg: "Comment deleted successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}