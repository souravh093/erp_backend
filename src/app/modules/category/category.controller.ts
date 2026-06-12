import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import sendResponse from '../../utils/sendResponse';
import { categoryService } from './category.service';

const createCategory = catchAsync(async (req, res) => {
  const response = await categoryService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: response,
  });
});

const getCategories = catchAsync(async (req, res) => {
  const { companyId } = req.user as { companyId: string };

  const response = await categoryService.getCategoriesFromDB(
    companyId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully',
    data: response,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const response = await categoryService.getCategoryByIdFromDB(req.params.id);

  if (!response) {
    throw new AppError(404, 'Category not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category retrieved successfully',
    data: response,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const response = await categoryService.updateCategoryFromDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully',
    data: response,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category deleted successfully',
  });
});

export const categoryController = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
