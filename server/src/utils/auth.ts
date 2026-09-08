import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'fake-investment-detection-jwt-secret-key';
};

const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const generateToken = (userId: string, role: string = 'user') => {
  return jwt.sign({ userId, role }, getJwtSecret(), { expiresIn: JWT_EXPIRE as any });
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
