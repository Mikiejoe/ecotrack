import { TripModel } from "../models/trip.model.js";
import { BaseRepository } from "./base.repository.js";

class TripRepository extends BaseRepository {
  constructor() {
    super(TripModel);
  }

  async getTripById(id){
    return await this.findOne({_id:id})
  }
  
}

export const tripRepository = new TripRepository();
