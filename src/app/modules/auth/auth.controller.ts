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

const createUserByRootUser = catchAsync(async (req, res) => {
  const response = await authServices.createUserByRootUserIntoDB(
    req.body,
    req.params.rootUserId,
  );

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

const loggedInUser = catchAsync(async (req, res) => {
  const response = await authServices.loggedInUserFromDB(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: response,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const response = await authServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: response.message,
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const response = await authServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: response.message,
    data: null,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const response = await authServices.changePassword(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: response.message,
    data: null,
  });
});

export const authController = {
  createUser,
  loginUser,
  loggedInUser,
  forgotPassword,
  resetPassword,
  changePassword,
  createUserByRootUser,
};
