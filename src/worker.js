import { Worker } from "bullmq";
import config from "./config/index.js";
import logger from "./core/logger.js";
import { checkAndNotifyManager } from "./jobs/alert.job.js";
import { sendEmail } from "./api/v1/services/mail.service.js";
import { addTelementry } from "./utils/addTelementry.js";

export const startTruckWorkers = () => {
  const worker = new Worker(
    "truck-data-queue",
    async (job) => {
      const { vehicle, fuel } = job.data;

      logger.info(`Processing data for Truck: ${vehicle}`);
      await addTelementry(job.data);
      if (fuel < 15) {
        logger.warn(`ALERT: Truck ${vehicle} has low fuel (${fuel}%)`);
        await checkAndNotifyManager(vehicle, fuel);
      }
    },
    { connection: config.redis },
  );

  worker.on("completed", (job) => logger.info(`Job ${job.id} has completed`));
  worker.on("failed", (job, err) =>
    logger.error(`Job ${job.id} failed: ${err.message}`),
  );
  return worker;
};

export const startNotificationWorker = () => {
  const notificationWorker = new Worker(
    "notification-queue",
    async (job) => {
      const { subject, html } = job.data;
      logger.info(`Sending email to: ${config.mail.manager}`);
      await sendEmail(config.mail.manager, subject, html);
    },
    { connection: config.redis },
  );

  notificationWorker.on("completed", (job) =>
    logger.info(`Notification Job ${job.id} has completed`),
  );
  notificationWorker.on("failed", (job, err) =>
    logger.error(`Notification Job ${job.id} failed: ${err.message}`),
  );
  return notificationWorker;
};
