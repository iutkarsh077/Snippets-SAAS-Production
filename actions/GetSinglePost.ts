"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { string } from "zod";

export async function GetSinglePost(id: string) {
    revalidatePath("/description");
    try {
        const getPost = await prisma.postSnippet.findFirst({
            where: {
                id: id,
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

        // console.log(getPost);
        return { msg: "Succeed to get The post", data: getPost, status: true }
    } catch (error) {
        return { msg: "Internal Server error", status: false }
    }
}