import { BusinessType } from '../../../../generated/prisma/client';

export type TAuthLoginPayload = {
  email: string;
  password: string;
};

export type TAuthRegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  companyId?: string;
  companyName?: string;
  businessType?: BusinessType;
};

export type TAuthRegisterByRootPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  companyId?: string;
};

export type TForgotPasswordPayload = {
  email: string;
};

export type TResetPasswordPayload = {
  token: string;
  email: string;
  newPassword?: string; // Optional if we just verify the token, but required for actual reset. Wait, let's make it required as it represents the new password payload.
  password?: string; // We can accept newPassword or password. Let's make it newPassword to be precise.
};

export type TChangePasswordPayload = {
  oldPassword?: string;
  newPassword?: string;
  password?: string; // Allow either newPassword or password to prevent client-side key mismatches.
};
