# EcoTrack: A Smart IoT Fleet & Logistics API.

## Project Overview: EcoTrack
An API for a logistics company to track a fleet of delivery vehicles. It monitors vehicle health (fuel, speed, location) and automatically triggers maintenance alerts or route optimizations.

**Folder Implementation Strategy**
--
|Folder |Feature Implementation |
|------|------|
|`/api/v1/controllers` |Endpoints for `Vehicle` registration, `Trip` logging, and `Driver` assignments.|
|`/api/v1/services` |`GeoService`: Logic to calculate if a vehicle is within a specific "Geofence" (delivery zone).|
|`/api/v1/middlewares` |`RateLimiter`: Specifically for the high-frequency IoT data pings from vehicles.|
|`/events` |`VehicleOverspeed` Event: When a vehicle exceeds 80mph, it triggers multiple listeners (log to DB, notify manager).|
|`/jobs` |`MaintenancePredictor`: A job that runs every midnight to analyze mileage and flag vehicles that need an oil change.|
|`/database/models` | High-performance schemas for `TelemetryData` (using Mongoose or Time-series logic).|
|`/scripts` |`ImportVehicleSpecs.ts`: A script to pull thousands of vehicle make/model specs from an external CSV or API.|
|`/lib` | A utility for converting GPS coordinates to human-readable addresses (Reverse Geocoding).|

------------


## The "Critical Failure" Scenario
This is where your modularity shines. Imagine a vehicle's engine temperature hits a critical level.
1. **Ingestion `(api/v1/controllers/telemetry.controller.ts)`**: Receives the data ping.
2. **Service `(telemetry.service.ts)`**: Checks the temperature against thresholds. If it's too high, it calls `Event.emit('ENGINE_CRITICAL', vehicleId)`.
3. **Events `(events/engine.listener.ts)`**: 
    - ***Listener A***: Instantly marks the vehicle status as "Disabled" in the DB.
    - ***Listener B***: Pushes a message to the Jobs queue.
4. **Jobs `(jobs/alert.job.ts)`**: A worker picks up the job and sends an emergency SMS to the driver and a push notification to the fleet manager.
5. **Logging `(core/logger.ts)`**: The entire sequence is logged in `logs/emergency.log` with a high critical priority for audit trails.

## Advanced Milestone Tasks:
1. **Geofencing Middleware:** Create a middleware in `src/api/v1/middlewares/checkZone.ts` that intercepts trip logs and checks if the driver is entering a "restricted zone."
2. **Modular Events:** Instead of one big event file, create `src/events/vehicle.events.ts` and `src/events/driver.events.ts` to keep the logic clean as the fleet grows.
3. **Automation Script:** Write a script in `src/scripts/generate-report.ts` that generates a PDF of the "Monthly Fleet Efficiency" and saves it into the `public/docs` folder.
4. **Zod Validators:** Implement strict TypeScript validation in `src/api/v1/validators/telemetry.schema.ts` to ensure the incoming GPS data from the "vehicles" is formatted correctly.

## Why this project?
It forces you to handle Separation of Concerns. <br>
You can't put the "SMS Alert" logic in the controller because the controller needs to return a 200 OK to the vehicle's hardware as fast as possible to keep the connection open. Everything else must be handled in `/events` and `/jobs`.