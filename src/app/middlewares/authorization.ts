import prisma from '../../db/db.config';
import configs from '../configs';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = () => {
  return catchAsync(async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: 'You are not authorized to access this route',
      });
    }

    const token = bearerToken.split(' ')[1];

    const decoded = jwt.verify(
      token,
      configs.jwtAccessSecret as string,
    ) as JwtPayload;

    const { email } = decoded;

    const user = await prisma.adminUser.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const hasRequiredFeature = user.role === 'admin';

    if (!hasRequiredFeature) {
      throw new AppError(403, 'You are not authorized to access this route');
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
