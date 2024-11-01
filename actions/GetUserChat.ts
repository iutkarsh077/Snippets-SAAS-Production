"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { GetUserDetails } from "./GetUserDetails";

export async function GetUserChat() {
    revalidatePath("/userChat");
    try {
        const getUserDetails = await GetUserDetails();
        if (!getUserDetails.decodeCookieValue) {
            return { msg: "Something went wrong", status: false };
        }

        const getUserChat = await prisma.chat.findMany({
            where: {
                receiverId: getUserDetails.decodeCookieValue.id
            },
            select: {
                id: true,
                text: true,
                sender: {
                    select: {
                        username: true,
                        profileImage: true
                    }
                },
                receiverId: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if (!getUserChat) {
            return { msg: "Failed to get messages, Please try again", status: false };
        }
        // console.log(getUserChat)
        return { msg: "Successfully get the Chat", getUserChat, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}