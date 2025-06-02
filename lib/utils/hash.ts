import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a plain‐text password.
 * @param password Plain‐text password to be hashed.
 * @returns Bcrypt hash string.
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate salt with SALT_ROUNDS, then hash:
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}
