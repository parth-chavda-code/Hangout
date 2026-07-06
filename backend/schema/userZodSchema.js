import { z } from "zod";

//User Registration
export const userRegZod = z.strictObject({
    name: z.string().min(1, "Name is required").regex(
        /^[A-Za-z\s]+$/,
        "Name can only contain letters and spaces"
    ),
    email: z.string().email("Invalid Email"),
    password: z.string().min(4, "Password must be at least 4 characters long")
});

//User Login
export const userSigninZod = z.strictObject({
    email: z.string().email("Invalid Email"),
    password: z.string().min(4, "Password must be at least 4 characters long")
});