"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

interface dataTypes {
    text: string,
    uploadedImageUrl: string
}

export async function SaveFeedPost(data: dataTypes) {
    revalidatePath("/feeds/uploadfeeds");
    try {
        const { text, uploadedImageUrl } = data;
        if (!text && !uploadedImageUrl) {
            return { msg: "Fields are empty", status: false };
        }
        const userDetails = await GetUserDetails();
        if (!userDetails) {
            return { msg: "User details not found", status: false };
        }

        const savePost = await prisma.feeds.create({
            data: {
                content: text,
                image: uploadedImageUrl,
                authorId: userDetails.decodeCookieValue?.id
            }
        })
        // console.log(savePost)
        await redis.del("latestfeed");
        
        return { msg: "Post Saved successfully!", status: true };
    } catch (error) {
        return { msg: "Internal Server Error", status: false };
    }
}