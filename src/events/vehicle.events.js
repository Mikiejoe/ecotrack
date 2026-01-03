import { EventEmitter } from 'events';
import { addAlertJob } from '../jobs/alert.job.js';
export const vehicleEvents = new EventEmitter();
vehicleEvents.on('ENGINE_OVERHEAT', async (payload) => {
    console.log('Event Received: Engine Overheat. Offloading to background job...');
    // Pass the work to a background job so the API remains free
    await addAlertJob(payload);
});
//# sourceMappingURL=vehicle.events.js.map