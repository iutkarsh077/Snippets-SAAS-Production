import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const UsernameValidation = z.string().min(3, {
    message: "Username is too small"
}).max(20, "Username must have atmost 20 characters")
    .regex(/^[a-zA-Z0-9_]*$/, "Username must contain only letters, numbers and underscores")


const SchemaForSignup = z.object({
    username: UsernameValidation,
    name: z.string().min(3, { message: "Name is too shorter" }).max(20, { message: "Name is too longer" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must have atleast 6 characters" })
})


export type signUpTypes = z.infer<typeof SchemaForSignup>;
export const SignupResolver = zodResolver(SchemaForSignup); 