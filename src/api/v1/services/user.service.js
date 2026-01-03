import { userRepository } from "../../../database/repositories/user.repository.js";

export const register = async (data) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }
  const existing = await userRepository.findByEmail(data.email);
  if (existing) throw new Error("Email already taken");

  return await userRepository.create(data);
};

export const login = async (data) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }
  const user = await userRepository.findByEmail(data.email);
  if (!user) throw new Error("Wrong email or password");
  
};
