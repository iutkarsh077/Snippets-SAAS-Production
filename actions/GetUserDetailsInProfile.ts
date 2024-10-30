"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma";

export async function GetUserDetailsInProfile(){
    revalidatePath("/profile");

    try {
        const cookieStore = cookies();

        const getCookie = cookieStore.get("snippets")?.value as string;
        const decodeCookieValue = jwt.verify(getCookie, process.env.JWT_SECRET!) as JwtPayload;

        const findUser = await prisma.user.findFirst({
            where: {
                id: decodeCookieValue.id
            }
        })

        return { msg: "Get the user details", decodeCookieValue: findUser, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}