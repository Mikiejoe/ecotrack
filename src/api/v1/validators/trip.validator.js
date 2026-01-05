import { body } from "express-validator";

export const tripValidation = [
  body('vehicle').isMongoId().withMessage('Invalid Vehicle ID'),
  body('driver').isMongoId().withMessage('Invalid Driver ID'),
  
  // Destination validation
  body('destination.coordinates').isArray({ min: 2, max: 2 }),
  body('destination.coordinates[0]').isFloat({ min: -180, max: 180 }).withMessage('Invalid Longitude'),
  body('destination.coordinates[1]').isFloat({ min: -90, max: 90 }).withMessage('Invalid Latitude'),

  // StartPoint validation
  body('startPoint.coordinates').isArray({ min: 2, max: 2 }),
  body('startPoint.coordinates[0]').isFloat({ min: -180, max: 180 }),
  body('startPoint.coordinates[1]').isFloat({ min: -90, max: 90 })
];
