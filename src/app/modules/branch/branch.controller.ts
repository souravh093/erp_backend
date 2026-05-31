import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { branchService } from './branch.service';

const createBranch = catchAsync(async (req, res) => {
  const response = await branchService.createBranchIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Branch created successfully',
    data: response,
  });
});

const updateBranch = catchAsync(async (req, res) => {
  const response = await branchService.updateBranchIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Branch updated successfully',
    data: response,
  });
});

const deleteBranch = catchAsync(async (req, res) => {
  await branchService.deleteBranchFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Branch deleted successfully',
  });
});

const assignUserToBranch = catchAsync(async (req, res) => {
  const response = await branchService.assignUserToBranchInDB(
    req.params.branchId,
    req.params.userId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User assigned to branch successfully',
    data: response,
  });
});

const getBranches = catchAsync(async (req, res) => {
  const response = await branchService.getBranchesFromDB(req.params.companyId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Branches fetched successfully',
    data: response,
  });
});

const getBranchById = catchAsync(async (req, res) => {
  const response = await branchService.getBranchByIdFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Branch fetched successfully',
    data: response,
  });
});

export const branchController = {
  createBranch,
  updateBranch,
  deleteBranch,
  assignUserToBranch,
  getBranches,
  getBranchById,
};
