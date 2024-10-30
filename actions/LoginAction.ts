"use server";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function LoginUser(data: any) {
    if (!data || !data.password) {
        return { msg: "fields are empty", status: false };
    }

    try {
        const findUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: data.username
                    },
                    {
                        username: data.username
                    }
                ]
            }
        })

        if (!findUser) {
            return { msg: "Wrong Credentials", status: false };
        }

        const comparePassword = await bcrypt.compare(data.password, findUser.password);
        if (!comparePassword) {
            return { msg: "Wrong Credentials", status: false };
        }


        let token = jwt.sign({
            id: findUser.id, name: findUser.name, email: findUser.email, verified: findUser.verified
        }, process.env.JWT_SECRET!, { expiresIn: '10d' });

        const cookieStore = cookies();
        const cookie = cookieStore.set('snippets', token, { httpOnly: true, sameSite: 'lax', expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) });


        return { msg: "Login successful", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}