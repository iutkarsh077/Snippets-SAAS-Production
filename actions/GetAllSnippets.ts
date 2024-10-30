"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";

export async function GetAllSnippets() {
    revalidatePath("/snippets");

    try {
        const getAllSnippets = await prisma.postSnippet.findMany();

        return {msg: "Fetched all snippets", status: true, data: getAllSnippets};
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}