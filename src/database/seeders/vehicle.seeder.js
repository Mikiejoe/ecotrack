import 'dotenv/config';
import mongoose from 'mongoose';
import logger from '../../core/logger.js';
import { connectDB } from '../index.js';
import { vehicleRepository } from '../vehicle.reposotory.js';
const dummyVehicles = [
    {
        vin: '1HGCM82635A0',
        make: 'Tesla',
        modelName: 'Model 3',
        year: 2023,
        status: 'active',
        location: { type: 'Point', coordinates: [-118.2437, 34.0522] }
    },
    {
        vin: '5UXWX7C50BA0',
        make: 'Ford',
        modelName: 'F-150 Lightning',
        year: 2024,
        status: 'active',
        location: { type: 'Point', coordinates: [-74.0060, 40.7128] } 
    },
    {
        vin: 'JN8AZ1CPXBT0',
        make: 'Rivian',
        modelName: 'R1T',
        year: 2024,
        status: 'maintenance',
        location: { type: 'Point', coordinates: [-122.4194, 37.7749] }
    }
];
const seed = async () => {
    try {
        logger.info('Starting database seeding...');
        await connectDB();
        for (const vehicle of dummyVehicles) {
            const exists = await vehicleRepository.findOne({ vin: vehicle.vin });
            if (!exists) {
                await vehicleRepository.create(vehicle);
                logger.info(`Seeded vehicle: ${vehicle.make} ${vehicle.modelName}`);
            }
            else {
                logger.info(`Vehicle with VIN ${vehicle.vin} already exists. Skipping.`);
            }
        }
        logger.info('Seeding completed successfully.');
    }
    catch (error) {
        logger.error('Seeding failed:', error);
    }
    finally {
        await mongoose.connection.close();
        logger.info('Database connection closed.');
        process.exit(0);
    }
};
seed();