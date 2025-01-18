"use server";

import { revalidatePath } from "next/cache";
import { GetUserDetails } from "./GetUserDetails";
import prisma from "../prisma";

export async function GetBugs() {
    revalidatePath("/explore/bugtracker");

    try {
        const getUser = await GetUserDetails();

        if (!getUser || !getUser.decodeCookieValue || !getUser.decodeCookieValue.id) {
            return { msg: "Unauthorized access", status: false };
        }

        const getAllBugs = await prisma.bugTracker.findMany({
            where: {
                userId: getUser.decodeCookieValue.id
            }
        })

        return { msg: "Successfully got all the bugs", data: getAllBugs, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}