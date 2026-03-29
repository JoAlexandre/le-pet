import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.NODE_ENV  === 'development' ? process.env.DB_HOST_DEV : process.env.DB_HOST,
    port: parseInt(process.env.NODE_ENV  === 'development' ? process.env.DB_PORT_DEV! : process.env.DB_PORT!, 10),
    name: process.env.NODE_ENV  === 'development' ? process.env.DB_NAME_DEV : process.env.DB_NAME,
    user: process.env.NODE_ENV  === 'development' ? process.env.DB_USER_DEV : process.env.DB_USER,
    password: process.env.NODE_ENV  === 'development' ? process.env.DB_PASSWORD_DEV : process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || '',
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    tenantId: process.env.MICROSOFT_TENANT_ID || 'common',
  },
  docs: {
    user: process.env.DOCS_USER || 'admin',
    password: process.env.DOCS_PASSWORD || 'admin',
  },
  upload: {
    baseUrl: process.env.UPLOAD_BASE_URL || '',
    storageProvider: process.env.STORAGE_PROVIDER || 'local',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
    s3Region: process.env.AWS_S3_REGION || 'us-east-1',
    s3AccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
    s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  },
  stripe: {
    secretKey: process.env.NODE_ENV  === 'development' ? process.env.STRIPE_SECRET_KEY_DEV : process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NODE_ENV  === 'development' ? process.env.STRIPE_PUBLISHABLE_KEY_DEV : process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
};
