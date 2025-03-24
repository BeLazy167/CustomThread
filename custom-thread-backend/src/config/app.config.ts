import { env } from './env.config';
import { logger } from './logger';

const validateMongoUri = (uri: string | undefined): string => {
    if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }
    return uri;
};

export const appConfig = {
    environment: env.NODE_ENV,
    server: {
        port: env.PORT,
    },
    database: {
        url: validateMongoUri(env.MONGODB_URI),
    },
    cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as const,
    },
    cloudinary: {
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        apiKey: env.CLOUDINARY_API_KEY,
        apiSecret: env.CLOUDINARY_API_SECRET,
    },
    clerk: {
        secretKey: env.CLERK_SECRET_KEY,
        publishableKey: env.CLERK_PUBLISHABLE_KEY,
    },
    stripe: {
        secretKey: env.STRIPE_SECRET_KEY,
        publishableKey: env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: env.WEBHOOK_ENDPOINT_SECRET,
    },
} as const;

// Validate critical configuration
try {
    validateMongoUri(appConfig.database.url);
    logger.info('Configuration loaded successfully');
} catch (error) {
    logger.error('Configuration validation failed:', error);
    process.exit(1);
}
