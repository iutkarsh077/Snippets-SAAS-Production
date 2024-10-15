import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const UsernameValidation = z.string().min(3, {
    message: "Username is too small"
}).max(20, "Username must have atmost 20 characters")
    .regex(/^[a-zA-Z0-9_]*$/, "Username must contain only letters, numbers and underscores")



const SchemaForLogin = z.object({
    username: UsernameValidation,
    password: z.string().min(6, { message: "Password must have atleast 6 characters" })
})


export type loginTypes = z.infer<typeof SchemaForLogin>;
export const loginResolver = zodResolver(SchemaForLogin); 