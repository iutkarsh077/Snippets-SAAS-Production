"use server";

import prisma from "../prisma";
import { GetUserDetails } from "./GetUserDetails";

export async function DeleteBug(id: string) {
    try {
        const getUser = await GetUserDetails();
        console.log(id);

        if (!getUser || !getUser.decodeCookieValue || !getUser.decodeCookieValue.id) {
            return { msg: "Unauthorized access denied", status: false };
        }

        await prisma.bugTracker.delete({
            where: {
                id
            }
        })

        // console.log(deleteBug);
        return { msg: "successfully deleted the task", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}