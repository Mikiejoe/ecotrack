import * as vehicleService from '../services/vehicle.service.js';
import logger from '../../../core/logger.js';
/**
 * Register a new vehicle in the fleet
 */
export const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.registerVehicle(req.body);
        logger.info(`Vehicle registered: ${vehicle.vin}`);
        res.status(201).json({ success: true, data: vehicle });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get details for a specific vehicle
 */
export const getVehicle = async (req, res, next) => {
    try {
        if (req.params.id) {
            const vehicle = await vehicleService.getVehicleById(req.params.id);
            return res.status(200).json({ success: true, data: vehicle });
        }
        else {
            return res.status(400).json({ success: false, message: 'Vehicle ID is required' });
        }
    }
    catch (error) {
        next(error);
    }
};
/**
 * Update vehicle telemetry (location and temperature)
 */
export const updateTelemetry = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === undefined)
            return res.status(400).json({ success: false, message: 'Vehicle ID is required' });
        const telemetryData = req.body;
        const updatedVehicle = await vehicleService.processTelemetryUpdate(id, telemetryData);
        res.status(200).json({
            success: true,
            message: 'Telemetry updated successfully',
            data: updatedVehicle
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get fleet-wide operational statistics
 */
export const getStats = async (req, res, next) => {
    try {
        logger.info('Fetching fleet statistics');
        const stats = await vehicleService.getFleetOverview();
        res.status(200).json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        logger.error('Error fetching stats: %o', error);
        next(error);
    }
};
/**
 * PATCH /api/v1/vehicles/:id/location
 */
export const updateLocation = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (id === undefined)
            return res.status(400).json({ success: false, message: 'Vehicle ID is required' });
        const { longitude, latitude } = req.body;
        // Basic validation check before hitting the service
        if (longitude === undefined || latitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Longitude and latitude are required.'
            });
        }
        const vehicle = await vehicleService.updateVehicleLocation(id, longitude, latitude);
        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            data: {
                vin: vehicle.vin,
                location: vehicle.location
            }
        });
    }
    catch (error) {
        logger.error(`Failed to update location for vehicle ${req.params.id}: %o`, error);
        next(error);
    }
};
//# sourceMappingURL=vehicle.controller.js.map