"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

interface dataType {
    status: string,
    id: string
}

export async function UpdateBugStatus(data: dataType) {
    revalidatePath("/explore/bugtracker");
    try {
        const upDateStatus = await prisma.bugTracker.update({
            where: {
                id: data.id
            },
            data: {
                status: data.status
            }
        })
        return { msg: "Successfully updated status", status: true }
    } catch (error) {
        return { msg: "Internal Server error", status: false }
    }
}