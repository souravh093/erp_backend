import bcrypt from 'bcryptjs';
import { User } from '../../../../generated/prisma/client';
import prisma from '../../../db/db.config';
import AppError from '../../errors/AppError';

const createUserIntoDB = async (user: User) => {
  const isExistingUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (isExistingUser) {
    throw new AppError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(user.password, 12);

  const response = await prisma.user.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  });

  return response;
};


export const authServices = {
    createUserIntoDB,
}