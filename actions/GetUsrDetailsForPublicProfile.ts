"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function GetDetailsForPublicProfile(username: string) {
    revalidatePath("/profile");
    try {
        const findUser = await prisma.user.findFirst({
            where: {
                username
            }
        })

        if(!findUser){
            return {msg: "User not found", status: false};
        }

        return {msg: "Get User successfully", decodeCookieValue: findUser, status: true};
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}