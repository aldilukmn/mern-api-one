import express from "express";
import { getUser, login, logout, register } from "../controllers/user.js";
import { validationLogin, validationRegister, validator } from "../validations/user.js";
import { verifyToken } from "../middleware/verify_token.js";
import refreshToken from "../controllers/refresh_token.js";

const router = express.Router();

router.get("/users", verifyToken, getUser);
router.post("/register", validationRegister, validator, register);
router.post("/login", validationLogin, validator, login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

export default router;
