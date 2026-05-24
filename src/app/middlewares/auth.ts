import { prisma } from '../../db/db.config';
import configs from '../configs';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = () => {
  return catchAsync(async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new AppError(401, 'You are not authorized to access this route');
    }

    const token = bearerToken.split(' ')[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        configs.jwtAccessSecret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token');
    }

    const { id, email } = decoded;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (!user.is_Active) {
      throw new AppError(403, 'User is inactive');
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
