import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  port: process.env.PORT,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminName: process.env.ADMIN_NAME,
  databaseUrl: process.env.DATABASE_URL,

  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailSecure: process.env.EMAIL_SECURE === 'true',
};
