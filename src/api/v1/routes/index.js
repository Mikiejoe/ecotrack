import { Router } from "express";
import vehicleRoutes from "./vehicle.routes.js";
import authRoutes from "./auth.routes.js";
import tripRoutes from "./trip.routes.js";
import telementryRoutes from "./telementry.routes.js";
const router = Router();
router.get("/health", (req, res) => res.sendStatus(200));
router.use("/vehicle", vehicleRoutes);
router.use("/auth", authRoutes);
router.use("/trip",tripRoutes)
router.use("/telementry", telementryRoutes);
export default router;
//# sourceMappingURL=index.js.map
