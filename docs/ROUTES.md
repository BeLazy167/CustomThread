# CustomThread Frontend Routes Documentation

This document provides detailed information about the CustomThread frontend routes, their components, and access control.

## Table of Contents

1. [Route Structure](#route-structure)
2. [Public Routes](#public-routes)
3. [Protected Routes](#protected-routes)
4. [Admin Routes](#admin-routes)
5. [Route Parameters](#route-parameters)
6. [Navigation](#navigation)

## Route Structure

The CustomThread frontend uses React Router for navigation. The main route configuration is defined in `src/App.tsx`:

```tsx
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
    <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
    
    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
        <Route path="/design" element={<Design />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reports/sales" element={<SalesReport />} />
        <Route path="/reports/designers/:designerId" element={<DesignerReport />} />
    </Route>
    
    {/* Public Routes */}
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/product-info/:id" element={<Product />} />
    <Route path="/order-tracking" element={<LivePackageJourney />} />
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/checkout/cancel" element={<CheckoutCancel />} />
    <Route path="/explore-designs" element={<Navigate to="/products" replace />} />
    <Route path="/receipt" element={<Receipt />} />
</Routes>
```

## Public Routes

These routes are accessible to all users, whether authenticated or not.

| Route                | Component           | Description                                   |
| -------------------- | ------------------- | --------------------------------------------- |
| `/`                  | `Home`              | Landing page with featured designs            |
| `/sign-in`           | `SignIn`            | User login page (provided by Clerk)           |
| `/sign-up`           | `SignUp`            | User registration page (provided by Clerk)    |
| `/products`          | `ProductsPage`      | Browse all available products                 |
| `/product-info/:id`  | `Product`           | View details of a specific product            |
| `/order-tracking`    | `LivePackageJourney`| Track order status and shipping               |
| `/checkout/success`  | `CheckoutSuccess`   | Successful checkout confirmation page         |
| `/checkout/cancel`   | `CheckoutCancel`    | Checkout cancellation page                    |
| `/receipt`           | `Receipt`           | Order receipt with purchase details           |

## Protected Routes

These routes require authentication. Users who are not signed in will be redirected to the sign-in page.

| Route                | Component           | Description                                   |
| -------------------- | ------------------- | --------------------------------------------- |
| `/design`            | `Design`            | 3D design customization tool                  |
| `/checkout`          | `Checkout`          | Checkout process for cart items               |
| `/profile`           | `ProfilePage`       | User profile with orders and designs          |

The protection is implemented using the `ProtectedRoute` component:

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const ProtectedRoute = () => {
    const { isSignedIn, isLoaded } = useAuth();
    
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    
    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;
```

## Admin Routes

These routes are restricted to admin users or specific usernames.

| Route                            | Component           | Access Control                     | Description                                   |
| -------------------------------- | ------------------- | ---------------------------------- | --------------------------------------------- |
| `/reports/sales`                 | `SalesReport`       | Admin or username "belazy167"      | Sales analytics dashboard                      |
| `/reports/designers/:designerId` | `DesignerReport`    | Admin or matching designer         | Designer performance analytics                 |

The admin access control is implemented in the component itself:

```tsx
// Example from SalesReport.tsx
const SalesReport = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if user is admin or has username "belazy167"
        if (!(user?.publicMetadata?.role === "admin" || user?.username === "belazy167")) {
            navigate("/");
        }
    }, [user, navigate]);
    
    // Component implementation
};
```

## Route Parameters

Some routes accept parameters to display specific content:

| Route                            | Parameter       | Description                                   |
| -------------------------------- | --------------- | --------------------------------------------- |
| `/product-info/:id`              | `id`            | ID of the product to display                  |
| `/reports/designers/:designerId` | `designerId`    | ID of the designer for the report             |

These parameters can be accessed in components using the `useParams` hook:

```tsx
import { useParams } from "react-router-dom";

const Product = () => {
    const { id } = useParams();
    // Use the ID to fetch product data
};
```

## Navigation

Navigation between routes is handled using the `useNavigate` hook and `Link` component from React Router:

### Using `useNavigate`

```tsx
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate("/products");
    };
    
    return <button onClick={handleClick}>View Products</button>;
};
```

### Using `Link`

```tsx
import { Link } from "react-router-dom";

const MyComponent = () => {
    return (
        <Link to="/products" className="my-link">
            View Products
        </Link>
    );
};
```

### Programmatic Navigation with Parameters

```tsx
const navigate = useNavigate();

// Navigate to a product page
navigate(`/product-info/${productId}`);

// Navigate with query parameters
navigate(`/products?category=shirts&sort=newest`);

// Navigate with state
navigate("/checkout", { state: { fromCart: true } });
```
