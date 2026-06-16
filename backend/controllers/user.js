import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userModel } from "../models/User.js";

//User Registration
export const userResgistration = async (req, res) => {
    const { name, email, password } = req.body;



    try {

        const findUser = await userModel.findOne({
            email: email
        });

        if (findUser) {
            return res.status(409).json({
                msg: "User already Registered"
            });
        }

        //pasword hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        res.json({
            msg: "User Registered Successfully"
        });

    } catch (err) {
        return res.status(500).json({
            msg: "Error when registring the user",
            error: err
        });
    }
};

//User Signin
export const userSignin = async (req, res) => {
    const { email, password } = req.body;

    try {

        const findUser = await userModel.findOne({
            email: email
        });

        if (!findUser) {
            return res.status(401).json({
                msg: "User is not registered yet"
            });
        }

        //verify password
        const checkPassword = await bcrypt.compare(password, findUser.password);

        if (!checkPassword) {
            return res.status(401).json({
                msg: "Invalid Password"
            });
        }

        //JWT assign
        const token = jwt.sign({
            _id: findUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: "2h"
        }) // don't need call dotenv.config in every file just call it in main index.js file

        res.json({
            msg: "User Loged in successfully",
            token: token
        });

    } catch (err) {
        res.status(500).json({
            msg: "Error in login route",
            error: err.message
        });
    }
}