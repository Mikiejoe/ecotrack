import logger from "../../../core/logger.js";
import { authService } from "../services/auth.service.js";
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized access attempt: No token provided");
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    logger.warn("Unauthorized access attempt: No token provided");
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = authService.validateAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    logger.error("JWT Verification failed: %o", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const validateApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized access attempt: No token provided");
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    logger.warn("Unauthorized access attempt: No token provided");
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = authService.validateAccessToken(token);

    req.vehicle = decoded;
    next();
  } catch (error) {
    logger.error("JWT Verification failed: %o", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
