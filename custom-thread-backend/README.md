# CustomThread Backend

A robust Node.js backend service for the CustomThread application, built with Express.js and TypeScript. This service handles design management, user authentication, image processing, and payment processing with Stripe.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
src/
├── config/             # Configuration files
│   ├── app.config.ts   # Application configuration
│   ├── database.ts     # Database configuration
│   └── logger.ts       # Logging configuration
├── controllers/        # Request handlers
│   └── v1/            # API version 1 controllers
│       ├── design.controller.ts  # Design management
│       └── order.controller.ts   # Order & payment processing
├── middleware/         # Express middleware
│   ├── auth.ts        # Authentication middleware
│   ├── error.middleware.ts  # Error handling
│   ├── isAdmin.ts     # Admin authorization
│   └── validate-request.ts  # Request validation
├── models/            # MongoDB models
│   ├── design.model.ts
│   └── order.model.ts
├── routes/            # API routes
│   └── v1/           # API version 1 routes
├── types/            # TypeScript type definitions
├── validators/       # Request validators
├── app.ts           # Express app setup
└── index.ts         # Application entry point
```

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=your_mongodb_connection_string

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
WEBHOOK_ENDPOINT_SECRET=your_stripe_webhook_secret

# Frontend URL (for success/cancel redirects)
FRONTEND_URL=http://localhost:5173

# Admin Configuration
ADMIN_USER_ID=your_admin_user_id
```

## 🔒 Authentication & Authorization

### Clerk Authentication

We use [Clerk](https://clerk.dev/) for authentication. The authentication flow works as follows:

1. Frontend sends requests with a Bearer token in the Authorization header
2. Our auth middleware validates the token using Clerk
3. User information is attached to the request object as `req.auth`
4. Protected routes can access user data via `req.auth.userId`

### Request Authentication Flow

```typescript
// Example protected route
router.post(
    '/designs',
    authenticate, // Clerk middleware
    validateRequest(designValidation.createDesign),
    designController.createDesign
);
```

The `authenticate` middleware:

- Validates the Bearer token
- Extracts user information
- Attaches it to `req.auth`
- Rejects unauthorized requests with 401

### Admin Authorization

For admin-only routes, we use the `isAdmin` middleware:

```typescript
// Example admin route
router.patch('/orders/:orderId/status', authenticate, isAdmin, orderController.updateOrderStatus);
```

The `isAdmin` middleware:

- Checks if the authenticated user has admin privileges
- Allows the request to proceed if the user is an admin
- Returns a 403 Forbidden response if the user is not an admin

## 🎨 Design Submission

### Design Creation Flow

1. **Authentication**: Request must include a valid Clerk token
2. **Validation**: Request body is validated against the schema
3. **User Association**: Design is associated with authenticated user
4. **Image Processing**: Images are stored in Cloudinary
5. **Database Storage**: Design data is stored in MongoDB

### Design Schema

```typescript
interface DesignDetail {
    title: string; // 3-100 characters
    description: string; // Optional, max 1000 characters
    tags: string[]; // 1-10 tags
    color: string; // Hex color code
    price: number; // Minimum 0
}

interface Design {
    userId: string; // From auth token
    username: string; // Username for display
    designDetail: DesignDetail;
    image: string; // Cloudinary URL
    decal?: string; // Optional Cloudinary URL
}
```

### Validation Rules

```typescript
const designValidation = {
    createDesign: {
        body: {
            userId: optional(), // Extracted from auth token
            username: string().optional(),
            designDetail: {
                title: string().min(3).max(100),
                description: string().max(1000).optional(),
                tags: array(string()).min(1).max(10),
                color: regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
                price: number().min(0),
            },
            image: string().url(),
            decal: string().url().optional(),
        },
    },
};
```

## 💳 Payment Processing with Stripe

### Order & Checkout Flow

1. **Cart Creation**: User adds designs to their cart
2. **Checkout Initiation**: User provides shipping details and initiates checkout
3. **Order Creation**: Backend creates a pending order in the database
4. **Stripe Session**: Backend creates a Stripe checkout session
5. **Payment Processing**: User completes payment on Stripe-hosted page
6. **Webhook Handling**: Stripe sends webhook events to update order status
7. **Order Confirmation**: Order status is updated based on payment result

### Checkout Request Schema

```typescript
interface CheckoutSessionRequest {
    items: {
        designId: string;
        quantity: number;
        size: string;
        customizations?: {
            color?: string;
            text?: string;
            placement?: string;
        };
    }[];
    shippingDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
        contact: string;
        country: string;
        postalCode: string;
    };
}
```

### Stripe Integration

The application integrates with Stripe for secure payment processing:

1. **Checkout Session Creation**:

    - Creates a Stripe checkout session with product details
    - Configures success and cancel URLs
    - Stores order ID in session metadata

2. **Webhook Handling**:

    - Listens for Stripe webhook events
    - Processes `checkout.session.completed` events
    - Updates order status based on payment result
    - Handles payment failures and successes

3. **Testing Stripe Integration**:
    - Use Stripe test mode with test API keys
    - Use test card numbers (e.g., 4242 4242 4242 4242 for success)
    - Test webhooks locally using Stripe CLI

### Order Management

Administrators can manage orders through the API:

1. **View Orders**: Get all orders or a specific order
2. **Update Status**: Change order status (pending, confirmed, processing, shipped, delivered, cancelled)
3. **Order Tracking**: Each order has a unique ID for tracking

## 🔄 CORS Configuration

CORS is configured to handle multiple origins securely:

### Basic Configuration

```typescript
{
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // 10 minutes
}
```

### Setting Up CORS

1. Configure allowed origins in your `.env` file:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

2. CORS error responses include:

```json
{
    "message": "CORS error: Origin not allowed",
    "allowedOrigins": ["http://localhost:5173", "http://localhost:3000"]
}
```

## 📊 Logging System

The application uses a comprehensive logging system built with Winston and Morgan:

### Log Structure

#### Request Logging

```typescript
{
    requestId: string,          // Unique identifier for request tracking
    method: string,            // HTTP method
    url: string,              // Request URL
    ip: string,              // Client IP
    userAgent: string,       // Client user agent
    userId: string,         // Authenticated user ID (if available)
    body: object,          // Request body (for non-GET requests)
    query: object,        // Query parameters
    params: object,      // URL parameters
    duration: string,   // Request duration
    statusCode: number // Response status code
}
```

#### Error Logging

```typescript
{
    error: string,           // Error message
    stack: string,          // Error stack trace
    method: string,        // HTTP method
    url: string,         // Request URL
    ip: string,        // Client IP
    userId: string,   // User ID if authenticated
    body: object,   // Request body
    query: object, // Query parameters
    params: object // URL parameters
}
```

### Log Files and Rotation

- **Daily Rotating Files**:
    - `logs/error-%DATE%.log`: Error-level logs
    - `logs/combined-%DATE%.log`: All logs
- **Rotation Policy**:
    - Maximum file size: 10MB
    - Retention period: 14 days
    - Date pattern: YYYY-MM-DD

### Environment-Specific Logging

#### Development

- Console output enabled with colors
- Debug level enabled
- Full error stacks
- Request body logging

#### Production

- File-only logging
- Info level minimum
- Sanitized error messages
- Limited request body logging

### Using the Logger

```typescript
import { logger } from './config/logger';

// Basic logging
logger.info('Server started');

// Logging with context
logger.info('User action', {
    userId: 'user123',
    action: 'create_design',
});

// Error logging
try {
    // ... code
} catch (error) {
    logger.error('Operation failed', {
        error: error.message,
        stack: error.stack,
    });
}
```

## 📡 API Endpoints

### Designs API (`/api/v1/designs`)

| Method | Endpoint | Description      | Auth Required | Request Body        | Response                                                                 |
| ------ | -------- | ---------------- | ------------- | ------------------- | ------------------------------------------------------------------------ |
| GET    | /        | List all designs | No            | -                   | `{ designs: Design[], total: number, page: number, totalPages: number }` |
| POST   | /        | Create a design  | Yes           | `DesignCreateInput` | `Design`                                                                 |
| GET    | /search  | Search designs   | No            | -                   | `{ designs: Design[], total: number, page: number, totalPages: number }` |
| GET    | /:id     | Get design by ID | No            | -                   | `Design`                                                                 |
| PATCH  | /:id     | Update design    | Yes           | `DesignUpdateInput` | `Design`                                                                 |
| DELETE | /:id     | Delete design    | Yes           | -                   | `{ message: string }`                                                    |

## ⚡ Performance Optimizations

1. **Compression**: Response compression using `compression` middleware
2. **CORS Caching**: CORS preflight requests are cached for 10 minutes
3. **MongoDB Indexes**: Proper indexes for frequently queried fields
4. **Request Limiting**: Large request bodies are limited to 50MB
5. **Image Optimization**: Images are processed and optimized via Cloudinary

## 🛡️ Security Measures

1. **Helmet**: Security headers are set using `helmet` middleware
2. **CORS**: Strict CORS policy with allowed origins
3. **Authentication**: Clerk-based authentication with token validation
4. **Input Validation**: Request validation using Zod
5. **Error Handling**: Centralized error handling without exposing internals
6. **Rate Limiting**: API rate limiting per IP and user
7. **Secure Headers**: HTTP security headers configured

## 🧪 Development Tools

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## 🐛 Debugging

For detailed logging in development:

```bash
# Windows
set DEBUG=custom-thread:* & npm run dev

# Unix
DEBUG=custom-thread:* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License

This project is licensed under the MIT License.
