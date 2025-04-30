# Environment Variables Guide for CustomThread

This guide explains how to use environment variables in the CustomThread project with Jenkins CI/CD.

## Table of Contents

1. [Overview](#overview)
2. [Jenkins Environment Variables](#jenkins-environment-variables)
3. [Frontend Environment Variables](#frontend-environment-variables)
4. [Backend Environment Variables](#backend-environment-variables)
5. [Setting Up Jenkins Credentials](#setting-up-jenkins-credentials)
6. [Local Development](#local-development)

## Overview

Environment variables are used to configure the application for different environments (development, QA, production). The Jenkins pipeline automatically sets the appropriate environment variables based on the branch being built:

-   `main` branch → Production environment
-   `qa` branch → QA environment
-   `dev` branch → Development environment

## Jenkins Environment Variables

The Jenkins pipeline uses the following environment variables:

```groovy
environment {
    // Directory paths
    FRONTEND_DIR = "custom-thread-frontend"
    BACKEND_DIR = "custom-thread-backend"

    // Branch and environment detection
    BRANCH_NAME = "${env.BRANCH_NAME}"
    DEPLOY_ENV = "${BRANCH_NAME == 'main' ? 'production' : (BRANCH_NAME == 'qa' ? 'qa' : 'development')}"

    // Docker image and container names
    FRONTEND_IMAGE = "custom-thread-frontend-${DEPLOY_ENV}"
    BACKEND_IMAGE = "custom-thread-backend-${DEPLOY_ENV}"
    FRONTEND_CONTAINER = "frontend-${DEPLOY_ENV}"
    BACKEND_CONTAINER = "backend-${DEPLOY_ENV}"

    // Port mapping based on environment
    FRONTEND_PORT = "${BRANCH_NAME == 'main' ? '3000' : (BRANCH_NAME == 'qa' ? '3001' : '3002')}"
    BACKEND_PORT = "${BRANCH_NAME == 'main' ? '4000' : (BRANCH_NAME == 'qa' ? '4001' : '4002')}"

    // Environment-specific configuration (from Jenkins credentials)
    MONGODB_URI = credentials('mongodb-uri')
    CLOUDINARY_URL = credentials('cloudinary-url')
    CLOUDINARY_CLOUD_NAME = credentials('cloudinary-cloud-name')
    CLOUDINARY_API_KEY = credentials('cloudinary-api-key')
    CLOUDINARY_API_SECRET = credentials('cloudinary-api-secret')
    CLERK_SECRET_KEY = credentials('clerk-secret-key')
    CLERK_PUBLISHABLE_KEY = credentials('clerk-publishable-key')
    STRIPE_SECRET_KEY = credentials('stripe-secret-key')
    STRIPE_PUBLISHABLE_KEY = credentials('stripe-publishable-key')
    WEBHOOK_ENDPOINT_SECRET = credentials('webhook-endpoint-secret')
}
```

## Frontend Environment Variables

The frontend application uses the following environment variables:

```
VITE_CLOUDINARY_URL
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_API_KEY
VITE_CLOUDINARY_API_SECRET
VITE_CLERK_PUBLISHABLE_KEY
VITE_API_URL
VITE_ENVIRONMENT
VITE_STRIPE_PUBLISHABLE_KEY
```

### Environment Variables Usage

These variables are used throughout the application for different purposes:

-   **Cloudinary Variables**: Used for image upload and management in the design customization feature
-   **Clerk Variables**: Used for authentication and user management
-   **API URL**: Base URL for backend API requests
-   **Environment**: Current environment (development, qa, production)
-   **Stripe Variables**: Used for payment processing integration

### Accessing Environment Variables in React

We've created a utility file at `src/utils/env.ts` to access environment variables in a consistent way:

```typescript
import env from "../utils/env";

// Using environment variables
const apiUrl = env.apiUrl;
const cloudName = env.cloudinary.cloudName;
const publishableKey = env.clerk.publishableKey;

// Checking the current environment
if (env.isDevelopment()) {
    console.log("Running in development mode");
} else if (env.isQA()) {
    console.log("Running in QA mode");
} else if (env.isProduction()) {
    console.log("Running in production mode");
}
```

## Backend Environment Variables

The backend application uses the following environment variables:

```
NODE_ENV
PORT
MONGODB_URI
CORS_ORIGIN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLERK_SECRET_KEY
CLERK_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
WEBHOOK_ENDPOINT_SECRET
FRONTEND_URL
ADMIN_USER_ID
```

### Environment Variables Usage

These variables are used throughout the backend for different purposes:

-   **Server Configuration**: `NODE_ENV`, `PORT` control the server behavior
-   **Database**: `MONGODB_URI` connects to the MongoDB database
-   **CORS**: `CORS_ORIGIN` defines allowed origins for cross-origin requests
-   **Cloudinary**: Used for image storage and processing
-   **Clerk**: Used for authentication and user management
-   **Stripe**: Used for payment processing
-   **Frontend URL**: Used for redirects after payment processing
-   **Admin Configuration**: Used to identify admin users

### Accessing Environment Variables in Node.js

In the backend, you can access environment variables using `process.env`:

```javascript
const port = process.env.PORT || 3001;
const mongodbUri = process.env.MONGODB_URI;
const corsOrigin = process.env.CORS_ORIGIN;
```

## Setting Up Jenkins Credentials

To use environment variables in Jenkins, you need to set up credentials:

1. Go to Jenkins > Manage Jenkins > Credentials > System > Global credentials
2. Click "Add Credentials"
3. Select "Secret text" as the kind
4. Enter the ID (e.g., `mongodb-uri`)
5. Enter the secret value
6. Click "OK"

Repeat for all required credentials:

-   `mongodb-uri`
-   `cloudinary-url`
-   `cloudinary-cloud-name`
-   `cloudinary-api-key`
-   `cloudinary-api-secret`
-   `clerk-secret-key`
-   `clerk-publishable-key`
-   `stripe-secret-key`
-   `stripe-publishable-key`
-   `webhook-endpoint-secret`

## Local Development

For local development, you can use `.env` files:

### Frontend

Create a `.env.local` file in the `custom-thread-frontend` directory:

```
VITE_CLOUDINARY_URL=your_cloudinary_url
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=http://localhost:3001
VITE_ENVIRONMENT=development
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Backend

Create a `.env` file in the `custom-thread-backend` directory:

```
# Server Configuration
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=your_mongodb_uri

# CORS
CORS_ORIGIN=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
WEBHOOK_ENDPOINT_SECRET=your_webhook_secret
```
