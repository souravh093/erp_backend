import prisma from '../../db/db.config';
import configs from '../configs';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const roleAuth = (...roles: Array<'CUSTOMER' | 'SELLER'>) => {
  return catchAsync(async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'You are not authorized to access this route',
      });
    }

    const token = bearerToken.split(' ')[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        configs.jwtAccessSecret as string,
      ) as JwtPayload;
    } catch (error) {
      console.log(error);
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Invalid or expired token',
      });
    }

    if (!roles.includes(decoded.role)) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: 'You are not authorized to access this route',
      });
    }

    const existingUser = roles.includes('CUSTOMER')
      ? await prisma.customerUser.findUnique({ where: { id: decoded.id } })
      : roles.includes('SELLER')
        ? await prisma.sellerUser.findUnique({ where: { id: decoded.id } })
        : null;

    if (!existingUser) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'User not found',
      });
    }

    req.user = { ...decoded, userData: existingUser };

    next();
  });
};
