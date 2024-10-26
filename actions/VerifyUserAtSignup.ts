"use server";
import prisma from "../prisma";

interface VerifyuserProps {
    username: string,
    otp: string
}

export async function VerifyUserAtSignup(data: VerifyuserProps) {
    try {
        const { username, otp } = data;

        if (!username || !otp) {
            return { msg: "Fields are empty", status: false };
        }

        const findUserName = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (!findUserName) {
            return { msg: "User not found", status: false };

        }

        if (findUserName.verificationOtp != otp) {
            return { msg: "Internal Server Error", status: false };
        }


        const verifyUser = await prisma.user.update({
            where: {
                id: findUserName.id
            },
            data: {
                verified: true
            }
        })

        return {msg: "User is verified Successfully", status: true};
    } catch (error) {
        return { msg: "Internal Server Error", status: false };
    }
}