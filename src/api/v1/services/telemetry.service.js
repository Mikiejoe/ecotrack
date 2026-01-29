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
  // console.log("d: ",d)

  await truckQueue.add("process-telemetry", d, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  });

  // await truckQueue.add("save-telemetry", data, {
  //   attempts: 3,
  //   backoff: { type: "exponential", delay: 1000 },
  // });
  return { status: "processing" };
};

export const fetchTelemetryStats = async () => {
  logger.info("Fetching telemetry statistics");

  const totalVehicles = await vehicleRepository.count();
  const alertsTriggered = await alertRepository.count();
  const telementryData = await telementryRepository.findAll();
  const telementryLn = telementryData.length;
  if (telementryLn < 1) {
    return {
      totalVehicles,
      averageTemperature: 0,
      alertsTriggered,
    };
  }

  let total = 0;

  telementryData.reduce((prev, curr) => {
    total += curr.temperature;
  }, telementryData[0]);
  const averageTemperature = total / telementryData.length;

  return {
    totalVehicles,
    averageTemperature,
    alertsTriggered,
  };
};
