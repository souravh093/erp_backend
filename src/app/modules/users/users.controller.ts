import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { usersServices } from './users.service';

const getMyPermissions = catchAsync(async (req, res) => {
  const response = await usersServices.getMyPermissionsFromDB(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Permissions fetched successfully',
    data: { permissions: response },
  });
});

export const usersController = {
  getMyPermissions,
};
