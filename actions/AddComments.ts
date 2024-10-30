"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma";
interface CommentsData {
    postId: string,
    content: string
}

export async function AddComments(data: CommentsData) {
    try {
        revalidatePath("/description");
        const cookieStore = cookies();
        const getToken = cookieStore.get("snippets")?.value as string;
        const userDetails = jwt.verify(getToken, process.env.JWT_SECRET!) as JwtPayload;

        if (!userDetails) {
            return { msg: "User not found", status: false };
        }

        const saveComment = await prisma.comment.create({
            data: {
                content: data.content,
                postId: data.postId,
                authorId: userDetails.id
            }
        })


        const allComment = await prisma.postSnippet.findFirst({
            where: {
                id: data.postId, // Ensure 'id' is defined and valid
            },
            include: {
                author: { // Including the author's details
                    select: {
                        name: true,
                        id: true
                    },
                },
                comments: { // Including comments and their related author
                    include: {
                        author: { // Include the author of the comment
                            select: {
                                name: true,
                                id: true
                            }
                        }
                    }
                }
            },
        });
        return { msg: "Get the comments", data: allComment,  status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}