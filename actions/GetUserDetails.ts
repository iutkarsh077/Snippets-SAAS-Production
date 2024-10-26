"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GetUserDetails(){
    revalidatePath("/");

    try {
        const cookieStore = cookies();

        const getCookie = cookieStore.get("snippets")?.value as string;
        const decodeCookieValue = jwt.verify(getCookie, process.env.JWT_SECRET!);

        console.log(decodeCookieValue);

        return { msg: "Get the user details", decodeCookieValue, status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}