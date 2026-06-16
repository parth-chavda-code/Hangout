//User Authentication

import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    //get token from hearder
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            msg: "Token Not provided"
        });
    }

    try {
        //compare and verify
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        req.id = verifyToken._id;

        next();
    } catch (err) {
        res.status(401).json({
            msg: "Error in auth.js middleware",
            error: err.message
        });
    }
}
