import jwt from "jsonwebtoken";
import config from "../../../config/index.js";



const ACCESS_TOKEN_SECRET = appConfig.accessTokenSecret;
const REFRESH_TOKEN_SECRET = appConfig.refreshTokenSecret;
const ACCESS_TOKEN_EXPIRES_IN = appConfig.accessTokenExpiresIn;
const REFRESH_TOKEN_EXPIRES_IN = appConfig.refreshTokenExpiresIn;

class AuthService {
    /**
     * Creates a new access token for a user.
     * @param {object} user - The user object containing _id, role, email, and school.
     * @returns {string} The generated JWT access token.
     * @throws {Error} If token creation fails.
     */
    async createAccessToken(user) {
        try {
            if (!user || !user._id || !user.role || !user.email) {
                throw new Error("Invalid user data provided for access token creation.");
            }
            return jwt.sign(
                {
                    _id: user._id,
                    role: user.role,
                    email: user.email,
                    schoolId: user.school // Assuming user.school contains the school ID
                },
                ACCESS_TOKEN_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
            );
        } catch (error) {
            console.error("Error creating access token:", error.message);
            throw new Error(`Failed to create access token: ${error.message}`);
        }
    }

    /**
     * Creates a new refresh token for a user.
     * @param {object} user - The user object containing _id.
     * @returns {string} The generated JWT refresh token.
     * @throws {Error} If token creation fails.
     */
    async createRefreshToken(user) {
        try {
            if (!user || !user._id) {
                throw new Error("Invalid user data provided for refresh token creation.");
            }
            return jwt.sign(
                {
                    _id: user._id
                },
                REFRESH_TOKEN_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
            );
        } catch (error) {
            console.error("Error creating refresh token:", error.message);
            throw new Error(`Failed to create refresh token: ${error.message}`);
        }
    }

    /**
     * Validates an access token.
     * @param {string} token - The access token to validate.
     * @returns {object|null} The decoded token payload if valid, otherwise null.
     */
    async validateAccessToken(token) {
        try {
            return jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (err) {
            console.warn("Access token validation failed:", err.message);
            return null;
        }
    }

    /**
     * Validates a refresh token.
     * @param {string} token - The refresh token to validate.
     * @returns {object|null} The decoded token payload if valid, otherwise null.
     */
    async validateRefreshToken(token) {
        try {
            return jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (err) {
            console.warn("Refresh token validation failed:", err.message);
            return null;
        }
    }

    /**
     * Refreshes an access token using a valid refresh token.
     * @param {string} refreshToken - The refresh token provided by the client.
     * @returns {string|null} A new access token if successful, otherwise null.
     * @throws {Error} If the refresh token is invalid, expired, or user not found.
     */
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = await this.validateRefreshToken(refreshToken);
            if (!decoded || !decoded._id) {
                throw new Error("Invalid or expired refresh token.");
            }

            const userId = decoded._id;
            const user = await userService.getById(userId); // Fetch user to get latest role/email/school
            if (!user) {
                throw new Error("User not found for refresh token.");
            }

            // Create a new access token
            const newAccessToken = await this.createAccessToken(user);
            return newAccessToken;
        } catch (error) {
            console.error("Error refreshing access token:", error.message);
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }

    /**
     * Generates a unique password reset token and stores it in the database with an expiry.
     * @param {string} userId - The ID of the user requesting a password reset.
     * @returns {string} The unhashed password reset token to be sent to the user.
     * @throws {Error} If user not found or token generation/storage fails.
     */
    async generatePasswordResetToken(userId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error("Invalid User ID format.");
            }

            const user = await userService.getById(userId);
            if (!user) {
                throw new Error("User not found.");
            }

            // Generate a random token
            const token = crypto.randomBytes(32).toString('hex');
            // Hash the token before storing (for security)
            // const hashedToken = await bcrypt.hash(token, 10); // Use bcrypt if installed

            // For now, without bcrypt, storing as is (NOT SECURE FOR PRODUCTION):
            console.warn("Password reset token is being stored without hashing. Implement bcrypt for security.");
            const hashedToken = token; // Placeholder if bcrypt is not used

            const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

            // Invalidate any existing tokens for this user
            await PasswordResetToken.deleteMany({ user: userId });

            await PasswordResetToken.create({
                user: userId,
                token: hashedToken,
                expiresAt: expiresAt,
            });

            return token; // Return the unhashed token to the user
        } catch (error) {
            console.error("Error generating password reset token:", error.message);
            throw new Error(`Failed to generate password reset token: ${error.message}`);
        }
    }

    async verifyPasswordResetToken(token) {
        try {
            // Hash the incoming token to compare with stored hashed tokens
            // const hashedToken = await bcrypt.hash(token, 10); // Use bcrypt if installed

            // For now, without bcrypt, direct comparison (NOT SECURE FOR PRODUCTION):
            const hashedToken = token; // Placeholder if bcrypt is not used

            const resetTokenDoc = await PasswordResetToken.findOne({ token: hashedToken }).lean();

            if (!resetTokenDoc) {
                throw new Error("Invalid password reset token.");
            }

            if (resetTokenDoc.expiresAt < new Date()) {
                await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id }); // Clean up expired token
                throw new Error("Password reset token has expired.");
            }

            return resetTokenDoc.user.toString(); // Return userId
        } catch (error) {
            console.error("Error verifying password reset token:", error.message);
            throw new Error(`Failed to verify password reset token: ${error.message}`);
        }
    }

    async invalidatePasswordResetToken(token) {
        try {
            // Hash the incoming token to find the stored one
            // const hashedToken = await bcrypt.hash(token, 10); // Use bcrypt if installed

            // For now, without bcrypt, direct comparison (NOT SECURE FOR PRODUCTION):
            const hashedToken = token; // Placeholder if bcrypt is not used

            const result = await PasswordResetToken.deleteOne({ token: hashedToken });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error invalidating password reset token:", error.message);
            throw new Error(`Failed to invalidate password reset token: ${error.message}`);
        }
    }
