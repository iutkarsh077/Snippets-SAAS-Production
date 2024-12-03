"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { GetUserDetails } from "./GetUserDetails";

export async function GetAllUser() {
    revalidatePath("/MessageList");

    try {
        const getUserDetails = (await GetUserDetails()).decodeCookieValue;
        const userFriends = await prisma.friends.findMany({
            where: {
                userId: getUserDetails?.id,
            },
            include: {
                friend: {
                    select: {
                        id: true,         // Fetch the id of the friend
                        username: true,
                        profileImage: true   // Fetch the username of the friend
                    }
                }
            }
        });

        // console.log(userFriends)
        return { msg: "Successfully get All users", data: userFriends, status: false };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}