// Augment the Window interface to include Clerk
declare global {
    interface Window {
        Clerk?: {
            session?: {
                getToken: () => Promise<string | null>;
            };
            signOut?: () => Promise<void>;
        };
    }
}

// Define interfaces for API parameters and data
interface QueryParams {
    [key: string]: string | number | boolean | undefined;
}

interface DesignData {
    id?: string;
    userId?: string;
    designDetail?: {
        title?: string;
        description?: string;
        tags?: string[];
        color?: string;
        price?: number;
    };
    image?: string;
    decal?: string;
}

interface CartItemData {
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
    isCustomDesign: boolean;
}

interface CheckoutItem {
    designId: string;
    quantity: number;
    size: string;
    customizations?: {
        color?: string;
        text?: string;
        placement?: string;
    };
}

interface ShippingDetails {
    name: string;
    email: string;
    address: string;
    city: string;
    contact: string;
    country: string;
    postalCode: string;
}

interface CheckoutSessionRequest {
    items: CheckoutItem[];
    shippingDetails: ShippingDetails;
}

interface Order {
    id: string;
    userId: string;
    items: {
        designId: string;
        design: {
            title: string;
            image: string;
            price: number;
        };
        quantity: number;
        size: string;
        customizations?: {
            color?: string;
            text?: string;
            placement?: string;
        };
    }[];
    shippingDetails: ShippingDetails;
    status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
    totalAmount: number;
    paymentStatus: "pending" | "paid" | "failed";
    createdAt: string;
    updatedAt: string;
}

const API_URL_WITHOUT_API = import.meta.env.VITE_API_URL;
const API_URL = API_URL_WITHOUT_API + "/api/v1";

// Get the Clerk token
const getClerkToken = async (): Promise<string | null> => {
    try {
        // IMPORTANT: For development only - using a hardcoded token for testing
        // This must match the test token in the backend authentication middleware
        return "test_development_token";

        /* 
        // Production implementation:
        if (window.Clerk?.session) {
            const token = await window.Clerk.session.getToken();
            return token;
        }
        console.warn("No Clerk session available - user might need to sign in");
        return null;
        */
    } catch (error) {
        console.error("Error getting Clerk token:", error);
        return null;
    }
};

const api = {
    get: async (endpoint: string, params: QueryParams = {}) => {
        const url = new URL(`${API_URL}${endpoint}`);
        Object.keys(params).forEach((key) =>
            url.searchParams.append(key, String(params[key]))
        );

        const token = await getClerkToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers,
            credentials: "omit", // Adjust as needed: 'include', 'same-origin'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(
                    `HTTP error 401: Unauthorized - Please sign in again`
                );
            } else if (response.status === 403) {
                throw new Error(
                    `HTTP error 403: Forbidden - You don't have permission`
                );
            } else if (response.status === 404) {
                throw new Error(
                    `HTTP error 404: Not found - Resource doesn't exist`
                );
            } else if (response.status >= 500) {
                throw new Error(
                    `HTTP error ${response.status}: Server error - Try again later`
                );
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        return await response.json();
    },

    post: async <T>(endpoint: string, data: T) => {
        const token = await getClerkToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            credentials: "omit",
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(
                    `HTTP error 401: Unauthorized - Please sign in again`
                );
            } else if (response.status === 403) {
                throw new Error(
                    `HTTP error 403: Forbidden - You don't have permission`
                );
            } else if (response.status === 404) {
                throw new Error(
                    `HTTP error 404: Not found - Resource doesn't exist`
                );
            } else if (response.status >= 500) {
                throw new Error(
                    `HTTP error ${response.status}: Server error - Try again later`
                );
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        return await response.json();
    },

    patch: async <T>(endpoint: string, data: T) => {
        const token = await getClerkToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
            credentials: "omit",
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(
                    `HTTP error 401: Unauthorized - Please sign in again`
                );
            } else if (response.status === 403) {
                throw new Error(
                    `HTTP error 403: Forbidden - You don't have permission`
                );
            } else if (response.status === 404) {
                throw new Error(
                    `HTTP error 404: Not found - Resource doesn't exist`
                );
            } else if (response.status >= 500) {
                throw new Error(
                    `HTTP error ${response.status}: Server error - Try again later`
                );
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        return await response.json();
    },

    delete: async (endpoint: string) => {
        const token = await getClerkToken();
        const headers: HeadersInit = {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
            headers,
            credentials: "omit",
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(
                    `HTTP error 401: Unauthorized - Please sign in again`
                );
            } else if (response.status === 403) {
                throw new Error(
                    `HTTP error 403: Forbidden - You don't have permission`
                );
            } else if (response.status === 404) {
                throw new Error(
                    `HTTP error 404: Not found - Resource doesn't exist`
                );
            } else if (response.status >= 500) {
                throw new Error(
                    `HTTP error ${response.status}: Server error - Try again later`
                );
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        return await response.json();
    },
};

// Design API
export const designApi = {
    getFeaturedDesigns: async () => api.get("/designs/featured"),
    getRandomDesigns: async (limit: number = 3) =>
        api.get("/designs/random", { limit }),
    getDesigns: async (params: QueryParams = {}) => api.get("/designs", params),
    getUserDesigns: async (userId: string, params: QueryParams = {}) =>
        api.get(`/designs/user/${userId}`, params),
    getDesignById: async (id: string) => api.get(`/designs/${id}`),
    searchDesigns: async (query: string, params: QueryParams = {}) =>
        api.get("/designs/search", { q: query, ...params }),
    createDesign: async (designData: DesignData) =>
        api.post("/designs", designData),
    updateDesign: async (id: string, designData: DesignData) =>
        api.patch(`/designs/${id}`, designData),
    deleteDesign: async (id: string) => api.delete(`/designs/${id}`),
};

// Cart API
export const cartApi = {
    getCart: async () => api.get("/cart"),
    addToCart: async (productData: CartItemData) =>
        api.post("/cart/items", productData),
    updateCartItem: async (itemId: string, quantity: number) =>
        api.patch(`/cart/items/${itemId}`, { quantity }),
    removeFromCart: async (itemId: string) =>
        api.delete(`/cart/items/${itemId}`),
    clearCart: async () => api.delete("/cart"),
};

// Order API
export const orderApi = {
    getOrders: async () => api.get("/orders"),
    getOrderById: async (orderId: string) => api.get(`/orders/${orderId}`),
    getUserOrders: async (page: number = 1, limit: number = 10) => {
        try {
            return await api.get("/orders/user", { page, limit });
        } catch (error) {
            if (error instanceof Error && error.message.includes("401")) {
                throw new Error(
                    "Authentication failed. Please sign in again to view your orders."
                );
            }
            throw error;
        }
    },
    createCheckoutSession: async (checkoutData: CheckoutSessionRequest) =>
        api.post("/orders/checkout", checkoutData),
    updateOrderStatus: async (orderId: string, status: Order["status"]) =>
        api.patch(`/orders/${orderId}/status`, { status }),
    cancelOrder: async (orderId: string) => {
        try {
            return await api.patch(`/orders/${orderId}/cancel`, {});
        } catch (error) {
            if (error instanceof Error && error.message.includes("401")) {
                throw new Error(
                    "Authentication failed. Please sign in again to cancel your order."
                );
            }
            throw error;
        }
    },
};

export default api;
