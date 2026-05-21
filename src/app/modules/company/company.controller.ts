import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { companyServices } from './company.service';

const setupCompany = catchAsync(async (req, res) => {
  const response = await companyServices.setupCompany(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Company setup completed successfully',
    data: response,
  });
});

export const companyController = {
  setupCompany,
};
