import { userRepository } from "../../../database/repositories/user.repository.js";

export const createUser = async (data) => {
  try {
    return await userRepository.create(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserById = async (id) => {
  try {
    return await userRepository.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserByEmail = async (email) => {
  try {
    return await userRepository.findByEmail(email);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserByEmail2 = async (email) => {
  try {
    return await userRepository.findByEmail2(email);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async (userId, data) => {
  try {
    return await userRepository.update(userId, data);
  } catch (error) {
    throw error;
  }
};
