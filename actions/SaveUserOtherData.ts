"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma";

interface DataTypes {
    workplace: string;
    about: string;
    location: string;
    badges: string[];
}


export async function SaveUserOtherData(data: DataTypes) {
    try {
        revalidatePath("/profile");
        const { workplace, about, location, badges } = data;
        // console.log(data);
        const cookieStore = cookies();
        const getCookie = cookieStore.get("snippets")?.value as string;
        const decodeCookieValue = jwt.verify(getCookie, process.env.JWT_SECRET!) as JwtPayload;


        const userOtherInfo: any = {};

        if (workplace?.length > 1) userOtherInfo.workplace = workplace;
        if (about?.length > 1) userOtherInfo.about = about;
        if (badges?.length > 1) userOtherInfo.badges = badges;
        if (location?.length > 1) userOtherInfo.location = location;

        const saveUserOtherData = await prisma.user.update({
            where: {
                id: decodeCookieValue.id
            },
            data: userOtherInfo
        });

        // console.log(saveUserOtherData);
        let token = jwt.sign(
            {
                id: saveUserOtherData.id,
                name: saveUserOtherData.name,
                email: saveUserOtherData.email,
                verified: saveUserOtherData.verified,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '10d' }
        );

        cookieStore.set('snippets', token, { httpOnly: true, sameSite: 'lax', expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) });

        return { msg: "Data Saved Successfully", saveUserOtherData, status: true };
    } catch (error) {
        return { msg: "Internal Server Error", status: false };
    }
}
