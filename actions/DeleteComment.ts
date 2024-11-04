"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

interface DataTypes {
    commentId: string;
    postId: string
}

export async function DeleteComment(data: DataTypes) {
    revalidatePath("/description");
    const { commentId, postId } = data;
    try {
        await prisma.comment.delete({
            where: {
                id: commentId
            }
        })

        const getPost = await prisma.postSnippet.findFirst({
            where: {
                id: postId,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        id: true,
                        username: true
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                id: true,
                                username: true
                            }
                        }
                    }
                }
            },
        });

        return { msg: "Comment deleted successfully", data: getPost, status: true }
    } catch (error) {
        return { msg: "Internal Server error", status: false }
    }
}