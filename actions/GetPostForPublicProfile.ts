"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function GetPostForPublicProfile(username: string) {
    revalidatePath("/profile");
    try {
        const authorId = await prisma.user.findFirst({
            where: {
                username
            }
        })


        if(!authorId){
            return { msg: "User not found", status: false };
        }
        const findUser = await prisma.postSnippet.findMany({
            where: {
                authorId: authorId.id
            }
        })

        if (!findUser) {
            return { msg: "User not found", status: false };
        }

        return { msg: "Get User successfully", data: findUser, status: true };
    
    } catch (error) {
    return { msg: "Internal Server error", status: false };
    }
}