import logger from "../core/logger.js";
import { sendNotification } from "../api/v1/services/notification.service.js";
import { redis } from "../core/redis.js";


export async function checkAndNotifyManager(truckId, level) {
  const lockKey = `alert_sent:${truckId}`;
  const alreadyNotified = await redis.get(lockKey);

  if (!alreadyNotified) {
    logger.info(
      `Sending notification for Truck ${truckId} low fuel: ${level}%`,
    );
    await sendNotification(`Truck ${truckId} is low on fuel: ${level}%`);
    // i am using ioredis

    await redis.set(lockKey, "true", "EX", 3600);
  }
}
