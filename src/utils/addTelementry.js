import mongoose from "mongoose";
import config from "../config/index.js";
import LoggerInstance from "../core/logger.js";
import { telementryRepository } from "../database/repositories/telementry.repository.js";

function createMongoose() {
  mongoose
    .connect(config.database.uri)
    .then(() => console.log("Connected!"));
}

export async function addTelementry(data) {
    try {
        createMongoose()
        await telementryRepository.create(data)
        LoggerInstance.info(`telementry data saved`)
    } catch (error) {
        LoggerInstance.error(error.message)
    }finally{
        await mongoose.disconnect()
    }
}
