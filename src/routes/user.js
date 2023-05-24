import express from "express";
import { login, register } from "../controllers/user.js";
import { validationAccess, validator } from "../validations/user.js"

const router = express.Router();

router.post("/register", validationAccess, validator, register);
router.post("/login", validationAccess, validator, login);

export default router;