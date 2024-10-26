import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const UsernameValidation = z.string().min(3, {
    message: "Username is too small"
})


const SchemaForLogin = z.object({
    username: UsernameValidation,
    password: z.string().min(6, { message: "Password must have atleast 6 characters" })
})


export type loginTypes = z.infer<typeof SchemaForLogin>;
export const loginResolver = zodResolver(SchemaForLogin); 