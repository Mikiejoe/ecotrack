import { BaseRepository } from './base.repository.js';
import { VehicleModel } from '../models/vehicle.model.js';
export class VehicleRepository extends BaseRepository {
    constructor() {
        super(VehicleModel);
    }
    
    async findByVin(vin) {
        return await this.model.findOne({ vin }).exec();
    }
    async findById(id) {
        return await this.model.findOne({ _id:id }).exec();
    }
    async findOverheatingVehicles(threshold) {
        return await this.model.find({ lastTemperature: { $gt: threshold } }).exec();
    }
    async getFleetStats() {
        
        return await this.model.aggregate([
            {
                $group: {
                    _id: null,
                    totalVehicles: { $sum: 1 },
                    averageTemp: { $avg: '$lastTemperature' },
                    statusCounts: {
                        $push: '$status'
                    },
                    maintenanceRequired: {
                        $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalVehicles: 1,
                    averageTemp: { $round: ['$averageTemp', 2] },
                    maintenanceRequired: 1,
                    activeVehicles: {
                        $size: {
                            $filter: {
                                input: '$statusCounts',
                                as: 's',
                                cond: { $eq: ['$$s', 'active'] }
                            }
                        }
                    }
                }
            }
        ]);
    }
    
    async updateLocation(id, longitude, latitude) {
        return await this.model.findByIdAndUpdate(id, {
            $set: {
                'location.coordinates': [longitude, latitude]
            }
        }, { new: true } // Returns the document after update
        ).exec();
    }

    async count(){
        const num = await VehicleModel.countDocuments()
        return num
    }
}
// Export a singleton instance
export const vehicleRepository = new VehicleRepository();
