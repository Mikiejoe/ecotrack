import App from "./core/server.js";
import config from "./config/index.js";
import logger from "./core/logger.js";
import { connectDB } from "./database/index.js";
import { startTruckWorkers, startNotificationWorker } from "./worker.js";



const app = new App();

app.listen(config.port, () => {
  connectDB().then(async () => {
    logger.info(`Server available at http://localhost:${config.port}`);

    try {
      const truckWorker = startTruckWorkers();
      const notificationWorker = startNotificationWorker();
      
      logger.info("Background workers initialized and listening for jobs.");

      const gracefulShutdown = async (signal) => {
        logger.info(`Received ${signal}. Closing worker...`);
        await truckWorker.close();
        await notificationWorker.close();
        process.exit(0);
      };

      process.on("SIGINT", () => gracefulShutdown("SIGINT"));
      process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
      
    } catch (workerError) {
      logger.error("Failed to start worker:", workerError);
    }
  });
});