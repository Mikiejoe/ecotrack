import logger from '../core/logger.js';
export const addAlertJob = async (data) => {
    // This simulates putting the task into a Redis queue
    setTimeout(() => {
        logger.error(`[JOB] SMS Sent to Manager: Vehicle ${data.vehicleId} is overheating at ${data.temp}°C!`);
    }, 2000);
};
//# sourceMappingURL=alert.job.js.map