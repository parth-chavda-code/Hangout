import express from "express";
import { userResgistration, userSignin } from "../controllers/user.js";
import { userRegZod, userSigninZod } from "../schema/userZodSchema.js";
import { zodValidation } from "../middleware/zodValidation.js";


const userRouter = express.Router();

// User Registration
//userRegZod , user registration zod schema
userRouter.post("/registration", zodValidation(userRegZod), userResgistration);

//User Signin
userRouter.post("/signin", zodValidation(userSigninZod), userSignin);

export { userRouter };