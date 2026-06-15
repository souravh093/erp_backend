import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { productService } from './product.service';

const createProduct = catchAsync(async (req, res) => {
  const response = await productService.createProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: response,
  });
});

export const productController = {
    createProduct,
}
