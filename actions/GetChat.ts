"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export async function GetChat(selectedUserId: string) {
    revalidatePath("/");
    try {
        const getUserDetails = await GetUserDetails();
        console.log("Sender: ", getUserDetails?.decodeCookieValue?.id);
        console.log("Receiver: ", selectedUserId)
        const ChatBetweenThem = await prisma.chat.findMany({
            where: {
                OR: [
                    {
                        senderId: getUserDetails?.decodeCookieValue?.id,
                        receiverId: selectedUserId,
                    },
                    {
                        senderId: selectedUserId,
                        receiverId: getUserDetails?.decodeCookieValue?.id,
                    },
                ],
            },
            orderBy: {
                createdAt: 'asc', // Order messages by timestamp (ascending)
            },

            select: {
                text: true,
                senderId: true,
                createdAt: true
            }
        })

        return { msg: "Get the chats", chat: ChatBetweenThem, status: true };
    } catch (error) {
        console.log(error);
        return { msg: "Internal Server error", status: false };
    }
}