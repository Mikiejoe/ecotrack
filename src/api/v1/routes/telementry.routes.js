import { Router } from "express";
import {
  authenticate,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.moddleware.js";
import * as telementryController from "../controllers/telementry.controller.js";

const router = Router();

router.get("", authenticate, telementryController.getTelemetryStats);
router.post(
  "",
  validateApiKey,
  telementryValidation,
  validate,
  telementryController.logData
);

export default router;
