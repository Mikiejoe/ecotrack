import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = Router();
// This route is public (e.g., for a public tracking page)
router.get('/public-stats', vehicleController.getStats);
// All routes below this line will require a valid JWT
router.use(authenticate);
router.post('/', vehicleController.createVehicle);
router.patch('/:id/location', vehicleController.updateLocation);
export default router;
//# sourceMappingURL=vehicle.routes.js.map