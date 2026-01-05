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
}

export const telementryRepository = new TelementryRepository();
