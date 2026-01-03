import { DriverModel } from "../models/driver.model.js";
import { BaseRepository } from "./base.repository.js";


class DriverRepository extends BaseRepository{
    constructor(){
        super(DriverModel)
    }
}

export const driverRepository = new DriverRepository()