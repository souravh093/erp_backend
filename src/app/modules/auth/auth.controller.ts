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

export const authController = {
  createUser,
};
