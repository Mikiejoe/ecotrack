import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import config from "../../../config/index.js";
import mongoose from "mongoose";
import { userRepository } from "../../../database/repositories/user.repository.js";
import { authRepository } from "../../../database/repositories/auth.repository.js";
import logger from "../../../core/logger.js";

const ACCESS_TOKEN_SECRET = config.auth.jwtSecret;
const REFRESH_TOKEN_SECRET = config.auth.refreshSecret;
const ACCESS_TOKEN_EXPIRES_IN = config.auth.accessExpiresIn;
const REFRESH_TOKEN_EXPIRES_IN = config.auth.refreshExpiresIn;

class AuthService {
  createAccessToken(user) {
    try {
      if (!user || !user._id || !user.email) {
        throw new Error(
          "Invalid user data provided for access token creation."
        );
      }
      return jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );
    } catch (error) {
      console.error("Error creating access token:", error.message);
      throw new Error(`Failed to create access token: ${error.message}`);
    }
  }

  createRefreshToken(user) {
    try {
      if (!user || !user._id) {
        throw new Error(
          "Invalid user data provided for refresh token creation."
        );
      }
      return jwt.sign(
        {
          _id: user._id,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );
    } catch (error) {
      console.error("Error creating refresh token:", error.message);
      throw new Error(`Failed to create refresh token: ${error.message}`);
    }
  }

   validateAccessToken(token) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      logger.warn("Access token validation failed");
      return null;
    }
  }

   validateRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.warn("Refresh token validation failed:", err.message);
      return null;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = await this.validateRefreshToken(refreshToken);
      if (!decoded || !decoded._id) {
        throw new Error("Invalid or expired refresh token.");
      }

      const userId = decoded._id;
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found for refresh token.");
      }

      const newAccessToken = this.createAccessToken(user);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error.message);
      throw new Error(`Failed to refresh access token: ${error.message}`);
    }
  }

  async generatePasswordResetToken(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID format.");
      }

      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found.");
      }
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

      const expiresAt = new Date(Date.now() + 3600000);

      await authRepository.deleteByUser(userId);

      await authRepository.create({
        user: userId,
        token: hashedToken,
        expiresAt: expiresAt,
      });

      return token;
    } catch (error) {
      console.error("Error generating password reset token:", error.message);
      throw new Error(
        `Failed to generate password reset token: ${error.message}`
      );
    }
  }

  async verifyPasswordResetToken(token) {
    try {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
      
      const resetTokenDoc = await authRepository.findByToken(hashedToken);
    

      if (!resetTokenDoc) {
        return {
          message: "Invalid password reset token.",
          userId: null,
        };
        // throw new Error("Invalid password reset token.");
      }

      if (resetTokenDoc.expiresAt < new Date()) {
        await authRepository.delete(resetTokenDoc._id);
        // throw new Error("Password reset token has expired.");
        return {
          message: "Password reset token has expired.",
          userId: null,
        };
      }

      return {
        message: "Password reset token has expired.",
        userId: resetTokenDoc.user.toString(),
      };
    } catch (error) {
      console.error("Error verifying password reset token:", error.message);
      throw new Error(
        `Failed to verify password reset token: ${error.message}`
      );
    }
  }

  async invalidatePasswordResetToken(token) {
    try {
      const hashedToken = await bcrypt.hash(token, 10);
      const result = await authRepository.deleteByToken(hashedToken);
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error invalidating password reset token:", error.message);
      throw new Error(
        `Failed to invalidate password reset token: ${error.message}`
      );
    }
  }
  
  async createApiKey(vehicle){
    try {
      if (!vehicle || !vehicle._id) {
        throw new Error(
          "Invalid vehicle data provided for access token creation."
        );
      }
      return jwt.sign(
        {
          _id: vehicle._id,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
    } catch (error) {
      console.error("Error creating access token:", error.message);
      throw new Error(`Failed to create access token: ${error.message}`);
    }
  }
}


export const authService = new AuthService();
