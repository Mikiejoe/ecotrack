import logger from '../core/logger.js';

export const saveTelementryJob= async (data) =>{
    // This simulates putting the task into a Redis queue
    setTimeout(() => {
        logger.error(`[JOB] Data Saved: Vehicle ${data.vehicleId}!`);
    }, 2000);
}