"use server";

import Sendit from "@/helpers/SendIt";
import { revalidatePath } from "next/cache";

interface DataTypes{
    email: string;
    message: string;
}
export async function SendReview(data: DataTypes) {
    revalidatePath("/reviewUs");
    try {
        const {email, message } = data;

        if(!email || !message){
            return { msg: "Some Fields are empty", status: false };
        }

        await Sendit({to: "utkarshsingh132002@gmail.com", name: "Utkarsh", subject: "Review on Snippets", body: message})
        
        return { msg: "Review ent Successfully", status: true };
    } catch (error) {
        return { msg: "Internal Server error", status: false };
    }
}