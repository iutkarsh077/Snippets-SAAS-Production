"use server";
import Sendit from "@/helpers/SendIt";
import prisma from "../prisma";

interface VerifyuserProps {
    email: string,
}

export async function SentMailForForgotPassword(data: VerifyuserProps) {
    try {
        const { email } = data;

        if (!email) {
            return { msg: "Fields are empty", status: false };
        }

        const findUserEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!findUserEmail) {
            return { msg: "User not found", status: false };

        }

        const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
        await Sendit({ to: findUserEmail.email, name: findUserEmail.name, subject: "Email Verification", body: findUserEmail.verificationOtp })


        return { msg: "Email sent Successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server Error", status: false };
    }
}