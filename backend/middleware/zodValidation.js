
export function zodValidation(schema) {
    return (req, res, next) => {
        const zodRes = schema.safeParse(req.body);
        if (!zodRes.success) {
            const e = zodRes.error.flatten();
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