"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function SaveEditedFeed(feedText: string, feedId: string){
    revalidatePath("/feeds");
    try {
        const updatedFeedText = await prisma.feeds.update({
            where: {
                id: feedId
            },
            data: {
                content: feedText
            }
        })

        return {msg: "Successfully saved the updated feed", status: true};
    } catch (error) {
        return {msg: "Internal Server error", status: false};
    }
}