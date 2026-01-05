import { body } from "express-validator";

export const vehicleValidation = [
  body('vin').notEmpty().withMessage('VIN is required').trim().toUpperCase().isAlphanumeric().withMessage("Not valid VIN").isLength({ min: 6, max: 12 }).withMessage('Invalid VIN format'),
  body('make').notEmpty().withMessage('Vehicle make is required'),
  body('modelName').notEmpty().withMessage('Vehicle model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('status').optional().isIn(['active', 'maintenance', 'retired']),
  // Validating GeoJSON [longitude, latitude]
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be [longitude, latitude]'),
  body('location.coordinates.*').isFloat().withMessage('Coordinates must be numeric')
];