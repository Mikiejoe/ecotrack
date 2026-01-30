import logger from "../../../core/logger.js";
import { authService } from "../services/auth.service.js";
import { sendEmail } from "../services/mail.service.js";
import {
  createUser,
  getUserByEmail,
  getUserByEmail2,
  updateUser,
} from "../services/user.service.js";

class AuthController {
  async register(req, res, next) {
    try {
      const { email } = req.body;
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return next({ statusCode: 400, message: "User exists!" }, req, res);
      }
      const newUser = await createUser(req.body);
      if (!newUser) {
        throw new Error("Something went wrong!");
      }
      return res.sendStatus(201);
    } catch (error) {
      logger.error("Failed to register: ",error.message)
      next(error, req, res);
    }
  }

  async login(req, res, next) {
  
    try {
      const { email, password } = req.body;
      const user = await getUserByEmail2(email);
      if (!user) {
        next({ statusCode: 401, message: "Wrong email or password" }, req, res);
        return;
      }
      const isPasswordMatch = await user.isPasswordMatch(password);

      if (!isPasswordMatch) {
        next({ statusCode: 401, message: "Wrong email or password" }, req, res);
        return;
      }
      const accessToken = authService.createAccessToken(user);
      const refreshToken = authService.createRefreshToken(user);
      return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
       logger.error("Failed to login: ",error.message)
      return next(error, req, res);
    }
  }

  async refreshToken(req, res, next) {
    try {
      return res.sendStatus(200);
    } catch (error) {
       logger.error("Failed to refresh token: ",error.message)
      return next(error, req, res);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const { message, userId } =
        await authService.verifyPasswordResetToken(token);
      if (!userId) {
        return next({ statusCode: 400, message: message }, req, res);
      }
      const updatedUser = await updateUser(userId, { password });
      console.log(updatedUser);
      return res.sendStatus(200);
    } catch (error) {
       logger.error("Failed to reset password: ",error.message)
      return next(error, req, res);
    }
  }

  async requestPasswordReset(req, res, next) {
    const { email } = req.body;
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return next(
          { statusCode: 404, message: "User with email does not exist!" },
          req,
          res
        );
      }
      const resetToken = await authService.generatePasswordResetToken(user._id);

      const mailerRes = await sendEmail(
        email,
        "Password Reset",
        `<a href=http://localhost:5173/auth/passwordReset/?token=${resetToken}>`
      );
      console.log("res: ", mailerRes);
      return res.status(201).json({ resetToken });
    } catch (error) {
       logger.error("Failed to send pass reset token: ",error.message)
      return next(error, req, res);
    }
  }
}

export const authController = new AuthController();
