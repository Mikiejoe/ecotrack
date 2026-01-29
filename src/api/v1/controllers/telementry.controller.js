import * as telemetryService from "../services/telemetry.service.js";
export const logData = async (req, res, next) => {
  try {
    const { vehicle, temperature, location, fuel, speed } = req.body;
    const result = await telemetryService.processTelemetry(vehicle, {
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
