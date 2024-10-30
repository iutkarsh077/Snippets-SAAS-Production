"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma";


export async function SetCoverImage(imageUrl: string) {
    try {
        const cookieStore = cookies();

        const getCookie = cookieStore.get("snippets")?.value as string;
        const decodeCookieValue = jwt.verify(getCookie, process.env.JWT_SECRET!) as JwtPayload;

        const saveCoverImage = await prisma.user.update({
            where: {
                id: decodeCookieValue.id
            },
            data: {
                backgroundImage: imageUrl
            },

            select: {
                backgroundImage: true,
            },
        })

        let token = jwt.sign({
            id: decodeCookieValue.id, name: decodeCookieValue.name, email: decodeCookieValue.email, verified: decodeCookieValue.verified,
        }, process.env.JWT_SECRET!, { expiresIn: '10d' });

        const cookie = cookieStore.set('snippets', token, { httpOnly: true, sameSite: 'lax', expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) });

        return { msg: "Cover Image Saved Successfully", coverImage: saveCoverImage.backgroundImage, status: true };
    } catch (error) {
        return { msg: "Internal Server Error", status: false };
    }
}