import { check, validationResult } from "express-validator";

const validator = (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            message: error.array()[0].msg,
        })
    }
    next();
}

const validationAccess = [
    check("username", "Username is required!").notEmpty(),
    check("password", "Password is required!").notEmpty(),
]

export { validator, validationAccess };