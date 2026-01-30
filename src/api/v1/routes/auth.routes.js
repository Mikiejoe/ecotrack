import { Router } from "express";
import {
  loginValidation,
  userValidation,
} from "../validators/user.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", userValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.post("/password-reset", authController.requestPasswordReset);
router.patch("/reset-password", authController.resetPassword);
router.post("/refresh-token", authController.refreshToken);

export default router;
