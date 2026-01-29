import { tripRepository } from "../../../database/repositories/trip.repository.js";

class TripService {
  async createTrip(data) {
    try {
      return tripRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getTripById(id) {
    

    try {
      return tripRepository.getTripById(id);
    } catch (error) {
      throw error;
    }
  }

  async getTrips() {
    try {
      return tripRepository.findAll();
    } catch (error) {
      throw error;
    }
  }
  async updateLocation(location){
    try {
      
    } catch (error) {
      throw error
    }
  }
}

export const tripService = new TripService();
