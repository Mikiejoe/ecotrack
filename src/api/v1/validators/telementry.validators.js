export const telementryValidation = [
  body("vehicle").isMongoId().withMessage("Invalid Vehicle ID"),
  body("temperature").isFloat().withMessage("temperature must be numeric"),
  body("speed").isFloat().withMessage("speed must be numeric"),
  body("fuel").isFloat().withMessage("fuel must be numeric"),
  body("location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),
  body("location.coordinates.*")
    .isFloat()
    .withMessage("Coordinates must be numeric"),
];
