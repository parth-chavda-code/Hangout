
export function zodValidation(schema) {
    console.log("inside zod middleware")
    return (req, res, next) => {
        const zodRes = schema.safeParse(req.body);
        console.log(req.body);
        if (!zodRes.success) {
            const e = zodRes.error.flatten();
            console.log(e);
            return res.status(422).json({
                msg: "Zod Error",
                success: false,
                error: e.fieldErrors
            });
        } else {
            next();
        }

    }
}