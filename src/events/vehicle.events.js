import { EventEmitter } from 'events';
import { addAlertJob } from '../jobs/alert.job.js';
import { saveTelementryJob } from '../jobs/save.job.js';
export const vehicleEvents = new EventEmitter();

vehicleEvents.on('ENGINE_OVERHEAT', async (payload) => {
    console.log('Event Received: Engine Overheat. Offloading to background job...');
    await addAlertJob(`Vehicle ${payload.vehicleId} is overheating at ${payload.temp}°C!`);
});

vehicleEvents.on("OVERSPEAD", async (payload)=>{
    console.log('Event Received: overspeading. Offloading to background job...');
    await addAlertJob(`Vehicle ${payload.vehicleId} is overspeeding at ${payload.speed}kph!`);
})

vehicleEvents.on("SAVE_TELEMENTRY", async(payload)=>{
    console.log('Event Received: saving. Offloading to background job...');
    await saveTelemntryJob(payload)
})