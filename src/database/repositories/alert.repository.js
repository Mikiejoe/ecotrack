import { AlertModel } from "../models/telementry.model.js";
import { BaseRepository } from "./base.repository.js";

class AlertRepository extends BaseRepository {
  constructor() {
    super(AlertModel);
  }

  async findByVehicle(vehicleId) {
    return await this.findAll({ vehicle: vehicleId });
  }
  
  async findById(id){
    return await this.findOne({_id:id})
  }
  
  async count(){
    return await AlertModel.countDocuments()
  }
}

export const alertRepository = new AlertRepository();
