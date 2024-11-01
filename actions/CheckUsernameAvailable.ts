"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function CheckUsernameUnique(username: string) {
    revalidatePath("/sign-up");
    try {
        // console.log(username)
        const findUserName = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (findUserName) {
            return { message: "Username already exist", status: false }
        }

        return { message: "Username is available", status: true }
    } catch (error) {
        return { message: "Internal Server error", status: false }
    }
}