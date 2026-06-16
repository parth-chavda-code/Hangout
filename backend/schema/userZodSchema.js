import { z } from "zod";

export const userRegZod = z.strictObject({
    name: z.string(),
    email: z.string().email("Invalid Error"),
    password: z.string()
});

export const userSigninZod = z.strictObject({
    email: z.string().email("Invalid Email"),
    password: z.string()
});