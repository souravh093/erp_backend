import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { unitService } from './unit.service';

const createUnit = catchAsync(async (req, res) => {
  const response = await unitService.createUnitIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Unit created successfully',
    data: response,
  });
});

const getUnits = catchAsync(async (req, res) => {
  const { companyId } = req.params;

  if (!companyId) {
    throw new AppError(400, 'Company ID is required');
  }

  const response = await unitService.getUnitsFromDB(companyId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Units retrieved successfully',
    data: response,
  });
});

const getUnitById = catchAsync(async (req, res) => {
  const response = await unitService.getUnitByIdFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Unit retrieved successfully',
    data: response,
  });
});

const updateUnit = catchAsync(async (req, res) => {
  const response = await unitService.updateUnitFromDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Unit updated successfully',
    data: response,
  });
});

const deleteUnit = catchAsync(async (req, res) => {
  await unitService.deleteUnitFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Unit deleted successfully',
  });
});

export const unitController = {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
};
