import { BaseRepository } from "./base.repository.js";
import { UserModel } from "../models/auth.model.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }
 
  async findByEmail(email) {
    try {
      const user = await this.findOne({ email });
      if (!user) return null;
      return user;
    } catch (error) {
      throw error;
    }
  }
  async findById(id) {
    try {
      const user = await this.findOne({ _id: id });
      if (!user) return null;
      return user;
    } catch (error) {
      throw error;
    }
  }
 
}

export const userRepository = new UserRepository();
