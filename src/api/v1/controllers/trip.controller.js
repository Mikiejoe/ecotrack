import mongoose from "mongoose";
import logger from "../../../core/logger.js";
import { tripService } from "../services/trip.service.js";

class TripController {
  async postTrip(req, res, next) {
    try {
      const data = req.body;
      await tripService.createTrip(data);
      return res.sendStatus(201);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  }
  async getTrip(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid trip ID." });
      }
      const trip = await tripService.getTripById(id);
      if (!trip) return res.sendStatus(404);
      return res.status(200).json({ ...trip, __v: undefined });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  }
  async getTrips(req, res, next) {
    try {
      const trips = await tripService.getTrips();
      return res.status(200).json(trips);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  }
}

export const tripController = new TripController();
