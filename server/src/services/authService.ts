import User from '../models/User';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { AppError } from '../middleware/errorHandler';

export const registerUser = async (email: string, password: string, fullName: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    email,
    password: hashedPassword,
    fullName,
  });

  await user.save();

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    token,
  };
};
