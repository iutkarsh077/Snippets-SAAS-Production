"use server";
import Sendit from "@/helpers/SendIt";
import prisma from "../prisma";

interface VerifyuserProps {
    email: string,
    otp: string
}

export async function VerifyEmailForForgotPassword(data: VerifyuserProps) {
    try {
        const { email, otp } = data;
        if (!email || !otp) {
            return { msg: "Fields are empty", status: false };
        }
        
        const findUserEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        console.log(findUserEmail)

        if (!findUserEmail) {
            return { msg: "User not found", status: false };

        }

        if (findUserEmail.verificationOtp != otp) {
            return { msg: "Wrong credentials", status: false };

        }

        const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
        await prisma.user.update({
            where: {
                id: findUserEmail.id
            },
            data: {
                verificationOtp: randomNumber,
                verified: true
            }
        })

        return { msg: "User verified Successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server Error", status: false };
    }
}