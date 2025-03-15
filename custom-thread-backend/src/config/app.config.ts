import dotenv from 'dotenv';

// Load environment variables from .env file
const result = dotenv.config();

// Log environment loading status
if (result.error) {
    console.warn('Warning: No .env file found or error loading .env file.');
}

// Ensure critical environment variables are set
const checkCriticalEnvVars = () => {
    const criticalVars = ['MONGODB_URI'];
    const missing = criticalVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
        console.warn(`Warning: Missing critical environment variables: ${missing.join(', ')}`);
        console.warn('Application may not function properly without these variables.');
    }
};

checkCriticalEnvVars();

// Log MongoDB URI (redacted) for debugging
const logMongoDbUri = () => {
    const uri = process.env.MONGODB_URI;
    if (uri) {
        // Mask username/password in the URI for security
        const maskedUri = uri.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
        console.log(`MongoDB URI from environment: ${maskedUri}`);
    } else {
        console.log(
            'MongoDB URI is not set in environment variables. Using fallback local connection.'
        );
    }
};

logMongoDbUri();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());

export const appConfig = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    apiPrefix: '/api/v1',
    cors: {
        origin: function (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean | string) => void
        ) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, origin);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 600, // 10 minutes
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/custom-thread',
        // Add additional database configuration options here if needed
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        },
    },
    clerk: {
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '7d',
    },
};
