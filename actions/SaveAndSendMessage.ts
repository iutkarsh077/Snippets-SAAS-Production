"use server";

import prisma from "../prisma";
import { GetUserDetails } from "./GetUserDetails";

interface MessageData {
    receiverUsername: string;
    text: string;
}

export async function SaveAndSendMessage(data: MessageData) {
    try {
        const { text, receiverUsername } = data;
        if (!text || !receiverUsername) {
            return { msg: "Required Fields are Empty", status: false };
        }

        const getUserDetails = (await GetUserDetails()).decodeCookieValue;
        const findUser = await prisma.user.findFirst({
            where: {
                username: receiverUsername
            }
        })

        if (!findUser) {
            return { msg: "Required Fields are Empty", status: false };
        }
        await prisma.chat.create({
            data: {
                text: text,
                senderId: getUserDetails?.id,
                receiverId: findUser?.id,
            }
        })

        return { msg: "Message Sent Successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}