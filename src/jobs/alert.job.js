import logger from '../core/logger.js';
export const addAlertJob = async (message) => {
    // This simulates putting the task into a Redis queue
    setTimeout(() => {
        logger.error(`[JOB] SMS Sent to Manager:`,message);
    }, 2000);
};

// export const overSpeedJob = async 

