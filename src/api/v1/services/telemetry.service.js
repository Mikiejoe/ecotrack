import { vehicleEvents } from "../../../events/vehicle.events.js";
import logger from "../../../core/logger.js";
import { vehicleRepository } from "../../../database/repositories/vehicle.reposotory.js";
import { alertRepository } from "../../../database/repositories/alert.repository.js";
import { telementryRepository } from "../../../database/repositories/telementry.repository.js";

export const processTelemetry = async (vehicleId, data) => {
  logger.info(`Processing data for vehicle: ${vehicleId}`);
  vehicleEvents.emit("SAVE_TELEMENTRY", { vehicleId, data });

  if (data.temperature > 100) {
    logger.warn(`Critical temperature detected for ${vehicleId}`);
    vehicleEvents.emit("ENGINE_OVERHEAT", {
      vehicleId,
      temp: data.temperature,
    });
  }
  if (data.speed > 100) {
    logger.warn(`Critical speed detected for ${vehicleId}`);
    vehicleEvents.emit("OVERSPEAD", {
      vehicleId,
      speed: data.speed,
    });
  }

  return { status: "processed" };
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

  const total = 0;

  telementryData.reduce((prev, curr) => {
    total += curr.temperature;
  }, telementryData[0]);
  // const

  return {
    totalVehicles,
    averageTemperature,
    alertsTriggered,
  };
};
