import bcrypt from 'bcrypt';
import config from '../config';

const SALT_ROUNDS = Number(config.password_salt_rounds);

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * // Creating user
const hashed = await hashPassword(userPassword);

// Logging in
const isValid = await comparePassword(enteredPassword, storedHashedPassword);
if (!isValid) throw new Error("Invalid password");
 */
