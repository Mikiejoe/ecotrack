import { TelementryModel } from "../models/telementry.model.js";
import { BaseRepository } from "./base.repository.js";

class TelementryRepository extends BaseRepository {
  constructor() {
    super(TelementryModel);
  }

  async findByVehicle(vehicleId) {
    return await this.findAll({ vehicle: vehicleId });
  }
  
  async findById(id){
    return await this.findOne({_id:id})
  }
  
  async getStats() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: null, // We want the average across the whole collection
          averageTemperature: { $avg: "$temperature" },
          totalReadings: { $sum: 1 }
        }
      }
    ]);
    
    // Aggregate returns an array, so we return the first object or a default
    return stats[0] || { averageTemperature: 0, totalReadings: 0 };
  }
}

export const telementryRepository = new TelementryRepository();
