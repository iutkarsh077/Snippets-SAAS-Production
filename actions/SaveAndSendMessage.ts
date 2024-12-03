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
                username: receiverUsername,
            },
        });

        if (!findUser) {
            return { msg: "User not found", status: false };
        }

        // Check if the users are already friends
        const existingFriendship = await prisma.friends.findFirst({
            where: {
                OR: [
                    { userId: getUserDetails?.id, friendId: findUser.id },
                    { userId: findUser.id, friendId: getUserDetails?.id },
                ],
            },
        });

        if (!existingFriendship) {
            // If no friendship exists, create two records for the friendship
            const saveUser = await prisma.friends.create({
                data: {
                    userId: getUserDetails?.id, // The current user is creating the friendship
                    friendId: findUser.id,      // The user they are sending a message to
                },
            });

            const saveUser2 = await prisma.friends.create({
                data: {
                    userId: findUser.id,        // The recipient user is creating the friendship
                    friendId: getUserDetails?.id, // The current user is their friend
                },
            });
            console.log(saveUser, saveUser2)
        }

        // Send the message
        await prisma.chat.create({
            data: {
                text: text,
                senderId: getUserDetails?.id,
                receiverId: findUser?.id,
            },
        });

        return { msg: "Message Sent Successfully", status: true };
    } catch (error) {
        console.error(error);
        return { msg: "Internal Server error", status: false };
    }
}
