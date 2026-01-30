import { EventEmitter } from "events";
import { updateLocationJob } from "../jobs/location.job.js";

export const locationEvents = new EventEmitter();

vehicleEvents.on("ENGINE_OVERHEAT", async (payload) => {
  console.log(
    "Event Received: update location. Offloading to background job..."
  );
  await updateLocationJob(payload);
});
