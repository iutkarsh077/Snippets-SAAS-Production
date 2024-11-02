"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { GetUserDetails } from "./GetUserDetails";

export async function DeleteSnippet(id: any) {
    revalidatePath("/snippets");
    try {
        const getUserDetails = await GetUserDetails();

        if (!getUserDetails) {
            return { msg: "Unauthorized access denied", status: false }
        }


        await prisma.postSnippet.delete({
            where: {
                id: id
            }
        })

        return { msg: "Post Deleted Successfully", status: true }
    } catch (error) {
        return { msg: "Internal Server error", status: false }
    }
} 