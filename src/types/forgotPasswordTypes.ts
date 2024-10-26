import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";




const SchemaForVerifyEmailForgotPassword = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otp: z.string()
})


export type VerifyEmailforgotPasswordTypes = z.infer<typeof SchemaForVerifyEmailForgotPassword >;
export const VerifyEmailforgotPasswordResolver = zodResolver(SchemaForVerifyEmailForgotPassword ); 