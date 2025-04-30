# CustomThread Frontend

A modern React application for the CustomThread e-commerce platform, built with TypeScript, Vite, React Router, and TanStack Query. This application provides a seamless shopping experience for custom apparel designs.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── assets/              # Static assets (images, 3D models)
├── components/          # React components
│   ├── cart/            # Shopping cart components
│   ├── checkout/        # Checkout flow components
│   ├── design/          # 3D design customization
│   ├── product_list/    # Product listing components
│   ├── products/        # Product detail components
│   ├── profile/         # User profile components
│   ├── receipt/         # Order receipt components
│   ├── sidebar/         # Sidebar navigation
│   └── ui/              # Reusable UI components
├── data/                # Static data files
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── mutations/           # TanStack Query mutations
├── pages/               # Page components
├── providers/           # Context providers
├── services/            # API services
├── store/               # Global state management
│   └── slices/          # State slices
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🔑 Key Features

-   **3D Design Customization**: Interactive 3D model for designing custom apparel
-   **User Authentication**: Secure authentication with Clerk
-   **Shopping Cart**: Persistent shopping cart with Zustand state management
-   **Checkout Process**: Streamlined checkout with Stripe integration
-   **Order Management**: View and manage orders in user profile
-   **Sales Reporting**: Admin dashboard for sales analytics
-   **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🧭 Routes and Navigation

| Route                            | Component            | Description             | Access Control |
| -------------------------------- | -------------------- | ----------------------- | -------------- |
| `/`                              | `Home`               | Landing page            | Public         |
| `/sign-in`                       | `SignIn`             | User login              | Public         |
| `/sign-up`                       | `SignUp`             | User registration       | Public         |
| `/design`                        | `Design`             | 3D design customization | Protected      |
| `/products`                      | `ProductsPage`       | Product listing         | Public         |
| `/product-info/:id`              | `Product`            | Product details         | Public         |
| `/checkout`                      | `Checkout`           | Checkout process        | Protected      |
| `/checkout/success`              | `CheckoutSuccess`    | Order confirmation      | Public         |
| `/checkout/cancel`               | `CheckoutCancel`     | Checkout cancellation   | Public         |
| `/profile`                       | `ProfilePage`        | User profile            | Protected      |
| `/reports/sales`                 | `SalesReport`        | Sales analytics         | Admin only     |
| `/reports/designers/:designerId` | `DesignerReport`     | Designer performance    | Designer/Admin |
| `/receipt`                       | `Receipt`            | Order receipt           | Public         |
| `/order-tracking`                | `LivePackageJourney` | Order tracking          | Public         |

## 🔌 API Integration

The frontend communicates with the backend API using a custom API client:

```typescript
// Example API usage
import { designApi, orderApi, reportApi } from "@/services/api";

// Fetch designs
const designs = await designApi.getDesigns();

// Create checkout session
const checkout = await orderApi.createCheckoutSession(checkoutData);

// Get sales report
const report = await reportApi.getSalesReport(filters);
```

## 🔐 Authentication

Authentication is handled by Clerk:

```typescript
import { useUser, useAuth } from "@clerk/clerk-react";

function MyComponent() {
    const { isSignedIn, user } = useUser();
    const { userId } = useAuth();

    if (!isSignedIn) {
        return <p>Please sign in</p>;
    }

    return <p>Hello, {user.firstName}!</p>;
}
```

## 🛒 State Management

The application uses Zustand for global state management:

```typescript
import { useStore } from "@/store";
import { useCartStore } from "@/store";

// Access design state
const { color, logoDecal, fullDecal } = useStore();

// Access cart state
const { items, addItem, removeItem } = useCartStore();
```

## 📊 Data Fetching

Data fetching is handled by TanStack Query:

```typescript
import { useDesigns, useDesign } from "@/hooks/use-designs";
import { useUserOrders } from "@/hooks/use-user-orders";

// Fetch designs with pagination
const { data, isLoading } = useDesigns({ page: 1, limit: 10 });

// Fetch a specific design
const { data: design } = useDesign(designId);

// Fetch user orders
const { data: orders } = useUserOrders();
```

## 🧪 Development Tools

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Type check
npm run typecheck
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📜 License

This project is licensed under the MIT License.
