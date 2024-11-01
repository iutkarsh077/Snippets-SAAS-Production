"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function DeleteMessage(id: string) {
    revalidatePath("/userChat");
    try {
        await prisma.chat.delete({
            where: {
                id
            }
        })

        return { msg: "Message Deleted Successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}