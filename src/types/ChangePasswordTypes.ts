import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";




const SchemaForChangePassword = z.object({
    password: z.string().min(6, { message: "Password must have atleast 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must have atleast 6 characters" })
})


export type changePasswordTypes = z.infer<typeof SchemaForChangePassword>;
export const changePasswordResolver = zodResolver(SchemaForChangePassword); 