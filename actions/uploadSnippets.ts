"use server";
import { revalidatePath } from "next/cache";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "../prisma";

interface SnippetsData {
    code: string,
    language: string,
    question: string
}

export async function UploadSnippets(data: SnippetsData) {
    revalidatePath("/uploadSnippets");
    try {
        const cookieStore = cookies();
        const getToken = cookieStore.get("snippets")?.value as string;
        const userDetails = jwt.verify(getToken, process.env.JWT_SECRET!) as JwtPayload;

        const findUser = await prisma.user.findFirst({
            where: {
                email: userDetails.email
            }
        })

        if (!findUser) {
            return { msg: "Unauthorized access", status: false };
        }


        await prisma.postSnippet.create({
            data: {
                question: data.question,
                code: data.code,
                programmingLanguage: data.language,
                author: {
                    connect: { id: findUser.id }, 
                  },

            }
        })
        return { msg: "Snippets saved successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}