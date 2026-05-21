import bcrypt from 'bcryptjs';
import {
  BusinessType,
  SubscriptionStatus,
} from '../../../../generated/prisma/client';
import configs from '../../configs';
import AppError from '../../errors/AppError';
import { generateToken } from '../../utils/generateToken';
import { TAuthLoginPayload, TAuthRegisterPayload } from './auth.type';
import { prisma } from '../../../db/db.config';

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
        avatar: payload.avatar,
        password: hashedPassword,
        companyId: resolvedCompanyId,
      },
    });

    return createdUser;
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

  if (!isSubscriptionValid) {
    onboardingStep = 'SUBSCRIBE';
    redirect = '/subscribe';
  } else if (!isSetupComplete) {
    onboardingStep = 'COMPANY_SETUP';
    redirect = '/company-setup';
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

export const authServices = {
  createUserIntoDB,
  loginUserFromDB,
};
