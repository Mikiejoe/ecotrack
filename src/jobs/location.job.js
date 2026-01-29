import logger from '../core/logger.js';
import { tripRepository } from '../database/repositories/trip.repository.js';
export const updateLocationJob = async (id,data) => {
    // This simulates putting the task into a Redis queue
    // update the location for the trip
    tripRepository.update(id,data)
    setTimeout(() => {
        logger.info(`[JOB] Location updated:`,data);
    }, 2000);
};
