"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import bcrypt from "bcryptjs";

export async function ChangePasswordActions(data: any) {
    revalidatePath("/login");
    if (!data || !data.confirmPassword || !data.password || !data.email) {
        return { msg: "Fields are empty", status: false }
    }
    try {
        const findEmail = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        if (!findEmail) {
            return { msg: "wrong Credentials", status: false }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await prisma.user.update({
            where: {
                id: findEmail.id
            },
            data: {
                password: hashedPassword
            }
        })

        return { msg: "Credentials updated successfully", status: true }
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}