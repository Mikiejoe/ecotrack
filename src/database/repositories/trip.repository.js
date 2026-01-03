import { TripModel } from "../models/trip.model.js";
import { BaseRepository } from "./base.repository.js";

class TripRepository extends BaseRepository {
  constructor() {
    super(TripModel);
  }
}

export const tripRepository = new TripRepository();
