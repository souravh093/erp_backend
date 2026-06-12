import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  BusinessType,
  SubscriptionStatus,
} from '../../../../generated/prisma/client';
import configs from '../../configs';
import AppError from '../../errors/AppError';
import { generateToken } from '../../utils/generateToken';
import {
  TAuthLoginPayload,
  TAuthRegisterByRootPayload,
  TAuthRegisterPayload,
  TChangePasswordPayload,
  TForgotPasswordPayload,
  TResetPasswordPayload,
} from './auth.type';
import { prisma } from '../../../db/db.config';
import { sendResetPasswordEmail } from '../../utils/email';

type TOnboardingStep = 'SUBSCRIBE' | 'COMPANY_SETUP' | 'DONE';

const createUserIntoDB = async (payload: TAuthRegisterPayload) => {
  const isExistingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isExistingUser) {
    throw new AppError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const companyName = payload.companyName ?? `${payload.name} Company`;
  const businessType = payload.businessType ?? BusinessType.SHOP;

  const response = await prisma.$transaction(async (tx) => {
    let resolvedCompanyId = payload.companyId;

    if (resolvedCompanyId) {
      const existingCompany = await tx.company.findUnique({
        where: { id: resolvedCompanyId },
      });

      if (!existingCompany) {
        throw new AppError(404, 'Company not found');
      }
    } else {
      const company = await tx.company.create({
        data: {
          name: companyName,
          business_type: businessType,
          is_setup_complete: false,
        },
      });

      resolvedCompanyId = company.id;
    }

    const createdUser = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        isRoot: true,
        avatar: payload.avatar,
        password: hashedPassword,
        companyId: resolvedCompanyId,
      },
    });

    return createdUser;
  });

  return response;
};

const createUserByRootUserIntoDB = async (
  payload: TAuthRegisterByRootPayload,
  rootUserId: string,
) => {
  const rootUser = await prisma.user.findUnique({
    where: { id: rootUserId, isRoot: true },
  });

  if (!rootUser) {
    throw new AppError(403, 'Only root users can create new users');
  }

  const isExistingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isExistingUser) {
    throw new AppError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const response = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      companyId: rootUser.companyId,
    },
  });

  return response;
};

const loginUserFromDB = async (payload: TAuthLoginPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!existingUser) {
    throw new AppError(401, 'Invalid email please try again');
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    existingUser.password,
  );

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid password please try again');
  }

  if (!existingUser.is_Active) {
    throw new AppError(403, 'User is inactive');
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: existingUser.id },
  });

  const company = await prisma.company.findUnique({
    where: { id: existingUser.companyId },
  });

  const subscriptionStatus = subscription?.status ?? 'NONE';
  const isSubscriptionValid =
    subscription?.status === SubscriptionStatus.ACTIVE ||
    subscription?.status === SubscriptionStatus.PENDING;
  const isSetupComplete = company?.is_setup_complete ?? false;

  let onboardingStep: TOnboardingStep = 'DONE';
  let redirect: string | null = null;

  if (existingUser.isRoot) {
    if (!isSubscriptionValid) {
      onboardingStep = 'SUBSCRIBE';
      redirect = '/subscribe';
    }
  } else if (!isSetupComplete) {
    onboardingStep = 'COMPANY_SETUP';
    redirect = '/company-setup';
  } else {
    onboardingStep = 'DONE';
    redirect = '/dashboard';
  }

  const accessToken = generateToken(
    {
      id: existingUser.id,
      email: existingUser.email,
      companyId: existingUser.companyId,
      onboardingStep,
    },
    configs.jwtAccessSecret as string,
    configs.accessTokenExpiration as string,
  );

  const refreshToken = generateToken(
    {
      id: existingUser.id,
      email: existingUser.email,
      companyId: existingUser.companyId,
      onboardingStep,
    },
    configs.jwtRefreshSecret as string,
    configs.refreshTokenExpiration as string,
  );

  return {
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      companyId: existingUser.companyId,
    },
    subscriptionStatus,
    isSetupComplete,
    onboardingStep,
    redirect,
    accessToken,
    refreshToken,
  };
};

const loggedInUserFromDB = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new AppError(404, 'User not found');
  }

  return {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone,
    companyId: existingUser.companyId,
  };
};

const forgotPassword = async (payload: TForgotPasswordPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, 'User with this email does not exist');
  }

  if (!user.is_Active) {
    throw new AppError(403, 'User is inactive');
  }

  const secret = (configs.jwtAccessSecret as string) + user.password;
  const resetToken = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: '15m',
  });

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${user.email}`;

  await sendResetPasswordEmail(user.email, resetLink);

  return { message: 'Password reset link sent to your email' };
};

const resetPassword = async (payload: TResetPasswordPayload) => {
  const { token, email } = payload;
  const newPassword = payload.newPassword || payload.password;

  if (!newPassword) {
    throw new AppError(400, 'New password is required');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const secret = (configs.jwtAccessSecret as string) + user.password;

  try {
    jwt.verify(token, secret);
  } catch (error) {
    console.log(error);
    throw new AppError(400, 'Invalid or expired password reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: 'Password reset successfully' };
};

const changePassword = async (
  userId: string,
  payload: TChangePasswordPayload,
) => {
  const { oldPassword } = payload;
  const newPassword = payload.newPassword || payload.password;

  if (!newPassword) {
    throw new AppError(400, 'New password is required');
  }

  if (!oldPassword) {
    throw new AppError(400, 'Old password is required');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError(400, 'Invalid old password please try again');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};

export const authServices = {
  createUserIntoDB,
  createUserByRootUserIntoDB,
  loginUserFromDB,
  forgotPassword,
  resetPassword,
  changePassword,
  loggedInUserFromDB,
};
