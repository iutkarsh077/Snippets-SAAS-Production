"use server";

import { signUpTypes } from "@/types/SignupTypes";
import prisma from "../prisma";
import Sendit from "@/helpers/SendIt";
import bcrypt from "bcryptjs";

export async function CreateUserAccount(data: signUpTypes) {
    console.log(data);

    try {
        const findUser = await prisma.user.findFirst({
            where:
            {
                OR: [
                    {
                        email: data.email
                    },
                    {
                        username: data.username
                    }
                ]
            }
        })

        if (findUser) {
            return { msg: "Username already exist", status: false }
        }

        const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const createUser = await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: hashedPassword,
                verificationOtp: randomNumber
            }
        })

        console.log(createUser);


        await Sendit({to: data.email, name: data.name, subject: "Email Verification", body: randomNumber})
        
        return { msg: "User created successfully", status: true }
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}