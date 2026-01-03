import { Router } from "express";
import vehicleRoutes from "./vehicle.routes.js";
const router = Router();
router.get("/health", (req, res) => res.sendStatus(200));
router.use("/vehicle", vehicleRoutes);
export default router;
//# sourceMappingURL=index.js.map