"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function LogoutUser(){
    revalidatePath("/profile");
    const cookieStore = cookies();
    cookieStore.delete("snippets");
}