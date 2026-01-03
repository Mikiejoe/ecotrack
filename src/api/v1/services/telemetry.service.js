import { vehicleEvents } from '../../../events/vehicle.events.js';
import logger from '../../../core/logger.js';
export const processTelemetry = async (vehicleId, data) => {
    logger.info(`Processing data for vehicle: ${vehicleId}`);
    // Business Logic: Check for critical engine temperature
    if (data.temperature > 100) {
        logger.warn(`Critical temperature detected for ${vehicleId}`);
        // Trigger an event instead of handling the alert here
        vehicleEvents.emit('ENGINE_OVERHEAT', { vehicleId, temp: data.temperature });
    }
    return { status: 'processed' };
};
export const fetchTelemetryStats = async () => {
    // Simulate fetching stats from a data source
    logger.info('Fetching telemetry statistics');
    return {
        totalVehicles: 150,
        averageTemperature: 75,
        alertsTriggered: 5
    };
};
//# sourceMappingURL=telemetry.service.js.map