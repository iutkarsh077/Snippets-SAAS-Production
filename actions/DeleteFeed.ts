"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function DeleteFeed(feedId: string) {
    revalidatePath("/feeds");
    try {
        const deleteFeed = await prisma.feeds.delete({
            where: {
                id: feedId
            }
        })

        

        return { msg: "Successfully deleted the feed", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}