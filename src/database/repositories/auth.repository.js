import { PasswordResetTokenModel } from "../models/auth.model.js";
import { BaseRepository } from "./base.repository.js";

class AuthRepository extends BaseRepository {
  constructor() {
    super(PasswordResetTokenModel);
  }
  async findByToken(token) {
    return this.findOne({ token });
  }
  async deleteByUser(userId) {
    return this.deleteMany({ user: userId });
  }
  async deleteByToken(token) {
    return this.deleteMany({ token });
  }
  
}

export const authRepository = new AuthRepository();


class ApiKeyRepository extends BaseRepository{
  constructor() {
    super(PasswordResetTokenModel);
  }
  async findByKey(key) {
    return this.findOne({ key });
  }
}

export const apiKeyRepository = new ApiKeyRepository()