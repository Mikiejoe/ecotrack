// import { vehicleRepository } from 'database/vehicle.repository.js';
import { vehicleEvents } from '../../../events/vehicle.events.js';
import logger from '../../../core/logger.js';
import { vehicleRepository } from '../../../database/repositories/vehicle.reposotory.js';


export const registerVehicle = async (data) => {
    return await vehicleRepository.create(data);
};
/**
 * Fetches all vehicle 
 */

export const getVehicles = async ()=>{
    return await vehicleRepository.findAll()
}

/**
 * Fetches vehicle details by ID
 */
export const getVehicleById = async (id) => {
    const vehicle = await vehicleRepository.findById(id);
    return vehicle;
};
/**
 * Fetches vehicle details by vin
 */
export const getVehicleByVIN = async (vin) => {
    const vehicle = await vehicleRepository.findByVin(vin);
    return vehicle;
};
/**
 * The core logic for telemetry updates.
 * This function is responsible for both saving data and detecting anomalies.
 */
export const processTelemetryUpdate = async (id, telemetry) => {
    const { temperature, coordinates } = telemetry;
    // 1. Persist the new data via Repository
    const updatedVehicle = await vehicleRepository.update(id, {
        $set: {
            lastTemperature: temperature,
            'location.coordinates': coordinates
        }
    });
    if (!updatedVehicle) {
        throw new Error('Vehicle update failed: Vehicle not found');
    }
    // 2. Business Rule: Check for Overheating
    // We isolate this logic so it's easy to change the threshold later
    const TEMP_THRESHOLD = 100;
    if (temperature > TEMP_THRESHOLD) {
        logger.warn(`ANOMALY DETECTED: Vehicle ${updatedVehicle.vin} is at ${temperature}°C`);
        // 3. Trigger decoupled side-effects
        vehicleEvents.emit('ENGINE_OVERHEAT', {
            vehicleId: id,
            vin: updatedVehicle.vin,
            temperature,
            timestamp: new Date()
        });
    }
    return updatedVehicle;
};
export const getFleetOverview = async () => {
    const stats = await vehicleRepository.getFleetStats();
    if (!stats || stats.length === 0) {
        return {
            totalVehicles: 0,
            averageTemp: 0,
            maintenanceRequired: 0,
            activeVehicles: 0
        };
    }
    return stats[0];
};
/**
 * Updates vehicle coordinates and checks for location-based events
 */
export const updateVehicleLocation = async (id, longitude, latitude) => {
    const updatedVehicle = await vehicleRepository.updateLocation(id, longitude, latitude);
    if (!updatedVehicle) {
        throw new Error('Vehicle not found');
    }
    vehicleEvents.emit('LOCATION_UPDATED', { id, coordinates: [longitude, latitude] });
    return updatedVehicle;
};