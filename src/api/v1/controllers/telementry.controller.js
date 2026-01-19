import * as telemetryService from "../services/telemetry.service.js";
export const logData = async (req, res, next) => {
  try {
    const { vehicleId, temperature, location, fuel, speed } = req.body;
    // We don't "await" the heavy logic if we want a fast response
    const result = await telemetryService.processTelemetry(vehicleId, {
      temperature,
      location,
      fuel,
      speed,
    });
    res.status(202).json({ message: "Data received" });
  } catch (error) {
    next(error);
  }
};
export const getTelemetryStats = async (req, res, next) => {
  try {
    const stats = await telemetryService.fetchTelemetryStats();
    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
};
