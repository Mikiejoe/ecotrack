import { Router } from "express";
import vehicleRoutes from "./vehicle.routes.js";
import authRoutes from "./auth.routes.js";
const router = Router();
router.get("/health", (req, res) => res.sendStatus(200));
router.use("/vehicle", vehicleRoutes);
router.use("/auth", authRoutes);
export default router;
//# sourceMappingURL=index.js.map
