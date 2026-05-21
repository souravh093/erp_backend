import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

const createUser = catchAsync(async (req, res) => {
  const response = await authServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: response,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const response = await authServices.loginUserFromDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: {
      user: response.user,
      subscriptionStatus: response.subscriptionStatus,
      isSetupComplete: response.isSetupComplete,
      onboardingStep: response.onboardingStep,
      redirect: response.redirect,
    },
    token: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  });
});

export const authController = {
  createUser,
  loginUser,
};
