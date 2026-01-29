import { Router } from "express";
import * as vehicleController from "../controllers/vehicle.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { vehicleValidation } from "../validators/vehicle.validator.js";
const router = Router();
router.get("/public-stats", vehicleController.getStats);
router.use(authenticate);
router.post(
  "/",
  vehicleValidation,
  validate,
  vehicleController.createVehicle
);
router.get("/",vehicleController.getVehicles)
router.get("/:id",vehicleController.getVehicle)
router.patch("/:id/location", vehicleController.updateLocation);
export default router;
