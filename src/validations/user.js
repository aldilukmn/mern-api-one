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

const validationRegister = [
    check("username", "Username is required!").notEmpty(),
    check("email")
    .notEmpty().withMessage("Email is required!")
    .isEmail().withMessage("Invalid email format!"),
    check("password", "Password is required!").notEmpty(),
]

const validationLogin = [
    check("username", "Username is required!").notEmpty(),
    check("password", "Password is required!").notEmpty(),
]

export { validator, validationRegister, validationLogin };