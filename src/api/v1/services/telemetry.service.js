import logger from "../../../core/logger.js";
import { vehicleRepository } from "../../../database/repositories/vehicle.reposotory.js";
import { alertRepository } from "../../../database/repositories/alert.repository.js";
import { telementryRepository } from "../../../database/repositories/telementry.repository.js";
import { Queue } from "bullmq";
import config from "../../../config/index.js";

const truckQueue = new Queue("truck-data-queue", { connection: config.redis });

export const processTelemetry = async (vehicleId, data) => {
  logger.info(`<service> Processing data for vehicle: ${vehicleId}`);
  const d = {
    ...data,
    vehicle: vehicleId,
  };
  await truckQueue.add("process-telemetry", d, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  });

  return { status: "processing" };
};

export const fetchTelemetryStats = async () => {
  logger.info("Fetching telemetry statistics");

  const [totalVehicles, alertsTriggered, telemetryStats] = await Promise.all([
    vehicleRepository.count(),
    alertRepository.count(),
    telementryRepository.getStats()
  ]);

  return {
    totalVehicles,
    averageTemperature: telemetryStats.averageTemperature,
    alertsTriggered,
    totalDataPoints: telemetryStats.totalReadings
  };
};
