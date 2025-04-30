// Mock data for development purposes

export const mockOrders = [
  {
    _id: "ord123456789",
    user: "user123",
    items: [
      {
        _id: "item1",
        design: {
          _id: "design1",
          title: "Summer Vibes T-Shirt",
          price: 29.99,
          images: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
          ]
        },
        quantity: 1,
        size: "M",
        color: "Blue"
      },
      {
        _id: "item2",
        design: {
          _id: "design2",
          title: "Urban Street Hoodie",
          price: 49.99,
          images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
          ]
        },
        quantity: 1,
        size: "L",
        color: "Black"
      }
    ],
    shippingDetails: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA"
    },
    totalAmount: 79.98,
    status: "pending",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "ord987654321",
    user: "user123",
    items: [
      {
        _id: "item3",
        design: {
          _id: "design3",
          title: "Minimalist Logo Tee",
          price: 24.99,
          images: [
            "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
          ]
        },
        quantity: 2,
        size: "S",
        color: "White"
      }
    ],
    shippingDetails: {
      address: "456 Park Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA"
    },
    totalAmount: 49.98,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "ord567891234",
    user: "user123",
    items: [
      {
        _id: "item4",
        design: {
          _id: "design4",
          title: "Vintage Graphic Sweatshirt",
          price: 39.99,
          images: [
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
          ]
        },
        quantity: 1,
        size: "XL",
        color: "Gray"
      },
      {
        _id: "item5",
        design: {
          _id: "design5",
          title: "Athletic Performance Tee",
          price: 34.99,
          images: [
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
          ]
        },
        quantity: 1,
        size: "M",
        color: "Red"
      }
    ],
    shippingDetails: {
      address: "789 Broadway",
      city: "Chicago",
      state: "IL",
      postalCode: "60007",
      country: "USA"
    },
    totalAmount: 74.98,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockPagination = {
  page: 1,
  limit: 10,
  total: 3,
  totalPages: 1
};
