import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { roleService } from './role.service';

const createRole = catchAsync(async (req, res) => {
  const response = await roleService.createRoleIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Role created successfully',
    data: response,
  });
});

const getAllRolesOfCompany = catchAsync(async (req, res) => {
  const response = await roleService.getAllRolesOfCompanyFromDB(
    req.params.companyId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Roles fetched successfully',
    data: response,
  });
});

const getRoleById = catchAsync(async (req, res) => {
  const response = await roleService.getRoleByIdFromDB(req.params.roleId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role fetched successfully',
    data: response,
  });
});

const deleteRoleById = catchAsync(async (req, res) => {
  const response = await roleService.deleteRoleByIdFromDB(req.params.roleId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role deleted successfully',
    data: response,
  });
});

const updateRoleById = catchAsync(async (req, res) => {
  const response = await roleService.updateRoleByIdFromDB(
    req.params.roleId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role updated successfully',
    data: response,
  });
});

const assignRoleToUser = catchAsync(async (req, res) => {
  const response = await roleService.assignRoleToUserInDB(
    req.params.roleId,
    req.params.userId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role assigned to user successfully',
    data: response,
  });
});

export const roleController = {
  createRole,
  getAllRolesOfCompany,
  getRoleById,
  deleteRoleById,
  updateRoleById,
  assignRoleToUser,
};
