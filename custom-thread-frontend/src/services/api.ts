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

const API_URL = "http://localhost:3001/api/v1";

const api = {
    get: async (endpoint: string, params: QueryParams = {}) => {
        const url = new URL(`${API_URL}${endpoint}`);
        Object.keys(params).forEach((key) =>
            url.searchParams.append(key, String(params[key]))
        );
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "omit", // Adjust as needed: 'include', 'same-origin'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    post: async <T>(endpoint: string, data: T) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "omit",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    patch: async <T>(endpoint: string, data: T) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "omit",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    delete: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
            credentials: "omit",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },
};

// Design API
export const designApi = {
    getDesigns: async (params: QueryParams = {}) => api.get("/designs", params),
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

export default api;
