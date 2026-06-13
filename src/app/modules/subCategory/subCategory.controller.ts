import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { subCategoryService } from './subCategory.service';

const createSubCategory = catchAsync(async (req, res) => {
  const response = await subCategoryService.createSubCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'SubCategory created successfully',
    data: response,
  });
});

const updateSubCategory = catchAsync(async (req, res) => {
  const response = await subCategoryService.updateSubCategoryIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SubCategory updated successfully',
    data: response,
  });
});

const deleteSubCategory = catchAsync(async (req, res) => {
  const response = await subCategoryService.deleteSubCategoryFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SubCategory deleted successfully',
    data: response,
  });
});

export const subCategoryController = {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
