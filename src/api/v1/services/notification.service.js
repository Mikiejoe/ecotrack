import { Queue } from "bullmq";
import config from '../../../config/index.js';
import logger from '../../../core/logger.js';

export async function sendNotification(message) {
    // Logic to send notification (e.g., email, SMS)
    logger.info(`Notification sent: ${message}`);
    const notificationQueue = new Queue("notification-queue", { connection: config.redis });
    await notificationQueue.add("send-notification", { message });
}