# CustomThread API Documentation

This document provides detailed information about the CustomThread API endpoints, request/response formats, and authentication requirements.

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Designs API](#designs-api)
5. [Orders API](#orders-api)
6. [Reports API](#reports-api)

## Base URL

The base URL for all API endpoints is:

```
https://api.customthread.com/api/v1
```

For local development:

```
http://localhost:3001/api/v1
```

## Authentication

Most API endpoints require authentication using [Clerk](https://clerk.dev/). Authentication is performed by including a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

### Getting a Token

The token is automatically managed by the Clerk SDK in the frontend application. For testing purposes, you can obtain a token from the Clerk Dashboard or use the development token:

```
Authorization: Bearer development_token
```

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request was invalid or malformed
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The authenticated user does not have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses have the following format:

```json
{
  "status": "error",
  "message": "Error message",
  "details": {
    // Additional error details (optional)
  }
}
```

## Designs API

### List Designs

Retrieves a paginated list of designs.

- **URL**: `/designs`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `sort` (optional): Sort field (default: "createdAt")
  - `order` (optional): Sort order ("asc" or "desc", default: "desc")

**Response**:

```json
{
  "designs": [
    {
      "id": "design_id",
      "userId": "user_id",
      "username": "username",
      "designDetail": {
        "title": "Design Title",
        "description": "Design Description",
        "tags": ["tag1", "tag2"],
        "color": "#FF5733",
        "price": 29.99
      },
      "image": "https://cloudinary.url/image.jpg",
      "decal": "https://cloudinary.url/decal.png",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### Create Design

Creates a new design.

- **URL**: `/designs`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "userId": "user_id",
  "username": "username",
  "designDetail": {
    "title": "Design Title",
    "description": "Design Description",
    "tags": ["tag1", "tag2"],
    "color": "#FF5733",
    "price": 29.99
  },
  "image": "https://cloudinary.url/image.jpg",
  "decal": "https://cloudinary.url/decal.png"
}
```

**Response**:

```json
{
  "id": "design_id",
  "userId": "user_id",
  "username": "username",
  "designDetail": {
    "title": "Design Title",
    "description": "Design Description",
    "tags": ["tag1", "tag2"],
    "color": "#FF5733",
    "price": 29.99
  },
  "image": "https://cloudinary.url/image.jpg",
  "decal": "https://cloudinary.url/decal.png",
  "createdAt": "2023-10-15T12:00:00Z",
  "updatedAt": "2023-10-15T12:00:00Z"
}
```

### Search Designs

Searches for designs based on a query string.

- **URL**: `/designs/search`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `q` (required): Search query
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response**: Same as List Designs

### Get Random Designs

Retrieves a list of random designs.

- **URL**: `/designs/random`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `limit` (optional): Number of designs to return (default: 3)

**Response**:

```json
{
  "designs": [
    {
      "id": "design_id",
      "userId": "user_id",
      "username": "username",
      "designDetail": {
        "title": "Design Title",
        "description": "Design Description",
        "tags": ["tag1", "tag2"],
        "color": "#FF5733",
        "price": 29.99
      },
      "image": "https://cloudinary.url/image.jpg",
      "decal": "https://cloudinary.url/decal.png",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:00:00Z"
    }
  ]
}
```

### Get User Designs

Retrieves designs created by a specific user.

- **URL**: `/designs/user/:userId`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**:
  - `userId`: ID of the user
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response**:

```json
{
  "designs": [
    {
      "id": "design_id",
      "userId": "user_id",
      "username": "username",
      "designDetail": {
        "title": "Design Title",
        "description": "Design Description",
        "tags": ["tag1", "tag2"],
        "color": "#FF5733",
        "price": 29.99
      },
      "image": "https://cloudinary.url/image.jpg",
      "decal": "https://cloudinary.url/decal.png",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Get Design by ID

Retrieves a specific design by ID.

- **URL**: `/designs/:id`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**:
  - `id`: ID of the design

**Response**:

```json
{
  "id": "design_id",
  "userId": "user_id",
  "username": "username",
  "designDetail": {
    "title": "Design Title",
    "description": "Design Description",
    "tags": ["tag1", "tag2"],
    "color": "#FF5733",
    "price": 29.99
  },
  "image": "https://cloudinary.url/image.jpg",
  "decal": "https://cloudinary.url/decal.png",
  "createdAt": "2023-10-15T12:00:00Z",
  "updatedAt": "2023-10-15T12:00:00Z"
}
```

### Update Design

Updates a specific design.

- **URL**: `/designs/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: ID of the design
- **Request Body**: (All fields are optional)

```json
{
  "designDetail": {
    "title": "Updated Title",
    "description": "Updated Description",
    "tags": ["updated", "tags"],
    "color": "#00FF00",
    "price": 39.99
  },
  "image": "https://cloudinary.url/updated-image.jpg",
  "decal": "https://cloudinary.url/updated-decal.png"
}
```

**Response**: Updated design object

### Delete Design

Deletes a specific design.

- **URL**: `/designs/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: ID of the design

**Response**:

```json
{
  "message": "Design deleted successfully"
}
```

## Orders API

### List Orders

Retrieves a paginated list of orders for the authenticated user.

- **URL**: `/orders`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response**:

```json
{
  "orders": [
    {
      "id": "order_id",
      "userId": "user_id",
      "items": [
        {
          "design": {
            "id": "design_id",
            "title": "Design Title",
            "price": 29.99,
            "image": "https://cloudinary.url/image.jpg"
          },
          "quantity": 1,
          "size": "M",
          "color": "#FF5733"
        }
      ],
      "shippingDetails": {
        "name": "John Doe",
        "email": "john@example.com",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postalCode": "10001",
        "contact": "555-123-4567"
      },
      "status": "pending",
      "totalAmount": 29.99,
      "paymentStatus": "pending",
      "createdAt": "2023-10-15T12:00:00Z",
      "updatedAt": "2023-10-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get User Orders

Retrieves orders for the authenticated user.

- **URL**: `/orders/user`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Response**: Same as List Orders

### Get Order by ID

Retrieves a specific order by ID.

- **URL**: `/orders/:orderId`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `orderId`: ID of the order

**Response**: Single order object

### Create Checkout Session

Creates a Stripe checkout session for the provided items.

- **URL**: `/orders/checkout`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "items": [
    {
      "designId": "design_id",
      "quantity": 1,
      "size": "M",
      "customizations": {
        "color": "#FF5733",
        "text": "Custom Text",
        "placement": "front"
      }
    }
  ],
  "shippingDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001",
    "contact": "555-123-4567",
    "shippingMethod": "standard"
  }
}
```

**Response**:

```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

### Cancel Order

Cancels a specific order.

- **URL**: `/orders/:orderId/cancel`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `orderId`: ID of the order

**Response**:

```json
{
  "message": "Order cancelled successfully",
  "order": {
    // Order object with updated status
  }
}
```

### Update Order Status (Admin Only)

Updates the status of a specific order.

- **URL**: `/orders/:orderId/status`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Admin Only**: Yes
- **URL Parameters**:
  - `orderId`: ID of the order
- **Request Body**:

```json
{
  "status": "processing" // One of: pending, confirmed, processing, shipped, delivered, cancelled
}
```

**Response**: Updated order object

### Stripe Webhook

Handles Stripe webhook events.

- **URL**: `/orders/webhook`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**: Stripe event object

**Response**:

```json
{
  "received": true
}
```

## Reports API

### Generate Sales Report

Generates a sales report with analytics.

- **URL**: `/reports/sales`
- **Method**: `GET`
- **Auth Required**: No (temporarily for development)
- **Query Parameters**:
  - `startDate` (optional): Start date for report (YYYY-MM-DD)
  - `endDate` (optional): End date for report (YYYY-MM-DD)
  - `designerId` (optional): Filter by designer ID

**Response**:

```json
{
  "summary": {
    "totalSales": 100,
    "totalRevenue": 2999.99,
    "averageOrderValue": 29.99,
    "totalOrders": 50
  },
  "salesByDate": [
    {
      "date": "2023-10-01",
      "orders": 5,
      "revenue": 149.95
    }
  ],
  "salesByDesigner": [
    {
      "designerId": "designer_id",
      "designerName": "Designer Name",
      "orders": 20,
      "revenue": 599.80
    }
  ],
  "topSellingDesigns": [
    {
      "designId": "design_id",
      "title": "Design Title",
      "quantity": 15,
      "revenue": 449.85,
      "designer": "Designer Name"
    }
  ],
  "salesByCategory": [
    {
      "category": "T-Shirts",
      "quantity": 30,
      "revenue": 899.70
    }
  ]
}
```

### Generate Designer Report

Generates a report for a specific designer.

- **URL**: `/reports/designers/:designerId`
- **Method**: `GET`
- **Auth Required**: No (temporarily for development)
- **URL Parameters**:
  - `designerId`: ID of the designer
- **Query Parameters**:
  - `startDate` (optional): Start date for report (YYYY-MM-DD)
  - `endDate` (optional): End date for report (YYYY-MM-DD)

**Response**:

```json
{
  "summary": {
    "totalSales": 50,
    "totalRevenue": 1499.50,
    "averageOrderValue": 29.99
  },
  "designerMetrics": {
    "totalDesigns": 10,
    "activeDesigns": 8,
    "inactiveDesigns": 2,
    "avgRevenuePerDesign": 149.95
  },
  "salesByDate": [
    {
      "date": "2023-10-01",
      "orders": 3,
      "revenue": 89.97
    }
  ],
  "topSellingDesigns": [
    {
      "designId": "design_id",
      "title": "Design Title",
      "quantity": 10,
      "revenue": 299.90
    }
  ]
}
```

### Generate Design Report

Generates a report for a specific design.

- **URL**: `/reports/designs/:designId`
- **Method**: `GET`
- **Auth Required**: No (temporarily for development)
- **URL Parameters**:
  - `designId`: ID of the design
- **Query Parameters**:
  - `startDate` (optional): Start date for report (YYYY-MM-DD)
  - `endDate` (optional): End date for report (YYYY-MM-DD)

**Response**:

```json
{
  "summary": {
    "totalSales": 20,
    "totalRevenue": 599.80,
    "averageOrderValue": 29.99
  },
  "designMetrics": {
    "views": 500,
    "conversionRate": 4.0,
    "createdAt": "2023-09-01T12:00:00Z"
  },
  "salesByDate": [
    {
      "date": "2023-10-01",
      "orders": 2,
      "revenue": 59.98
    }
  ],
  "salesBySize": [
    {
      "size": "M",
      "quantity": 10,
      "revenue": 299.90
    }
  ],
  "salesByColor": [
    {
      "color": "#FF5733",
      "quantity": 8,
      "revenue": 239.92
    }
  ]
}
```
