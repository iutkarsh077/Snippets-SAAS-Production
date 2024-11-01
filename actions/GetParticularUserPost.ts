"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { GetUserDetails } from "./GetUserDetails";

export async function GetPostForProfile(){
    revalidatePath("/profile");
    try {
        const userDetails = await GetUserDetails();
        if(!userDetails){
            return { msg: "User not found", status: false };
        }

        const getAllSnippets = await prisma.postSnippet.findMany({
            where: {
                authorId: userDetails.decodeCookieValue?.id
            }
        });

        // console.log(getAllSnippets)
        return {msg: "Fetched all snippets", status: true, data: getAllSnippets};
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}