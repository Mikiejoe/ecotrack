import { Router } from "express";
import { tripValidation } from "../validators/trip.validator.js";
import { validate } from "../middlewares/validator.middleware.js";
import { tripController } from "../controllers/trip.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(authenticate)
router.post("",tripValidation,validate,tripController.postTrip)
router.get("",tripController.getTrips)
router.get("/:id",tripController.getTrip)

export default router