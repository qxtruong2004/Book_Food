//định nghĩa các hằng số quan trọng

//API Base URl
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

//auth
export const TOKEN_KEY = "access_token"
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user";

//API_ENDPOINTS
export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        ME: "/auth/me",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout"
    },
    USERS: {
        BASE: "/users",
        MY_PROFILE: "/users/my_profile",
        BY_ID: (id: number) => `/users/${id}`,
        ALL: "/users/all",
        UPDATE_PROFILE: "/users/update_profile",
        UPDATE_BY_ID: (id: number) => `/users/${id}`,
        BLOCKED: "/users/blocked",
        ACTIVE: "/users/active",
        CHANGE_STATUS: (id: number) => `/users/status/${id}`,
        SEARCH: "/users"
    },
    CATEGORIES: {
        BASE: "/categories",
        BY_ID: (id: number) => `/categories/${id}`,
        ALL: "/categories", // page, size gửi bằng params
        CREATE: "/categories",
        UPDATE: (id: number) => `/categories/${id}`,
        DELETE: (id: number) => `/categories/${id}`,
        TOTAL: "/categories/total-categories",
        SEARCH: "/categories/search" // keywords gửi bằng params
    },
    FOODS: {
        BASE: "/foods",

        ALL: "/foods", // page, size gửi bằng params
        BY_CATEGORY: (categoryId: number) => `/foods/category/${categoryId}`, // page, size gửi bằng params
        BY_ID: (id: number) => `/foods/${id}`,
        SEARCH: "/foods/search", // params gửi bằng axios params

        CREATE: "/foods",
        UPDATE: (id: number) => `/foods/${id}`,
        DELETE: (id: number) => `/foods/${id}`,
    },
    ORDERS: {
        BASE: "/orders",

        // Admin
        GET_ALL: "/orders",

        BY_USER: (userId: number) => `/orders/user/${userId}`, // page, size sẽ gửi bằng params
        UPDATE_STATUS: (orderId: number) => `/orders/${orderId}/status`, // status gửi bằng params
        TOTAL_REVENUE: `/orders/totalRevenue`, // startDate, endDate gửi bằng params
        DETAIL_ADMIN: (orderId: number) => `/orders/${orderId}`,

        CREATE: `/orders`,
        CANCEL: (orderId: number) => `/orders/${orderId}`,

        MY_ORDERS: `/orders/my_orders`, // page, size gửi bằng params
        MY_ORDER_DETAIL: (orderId: number) => `/orders/my_orders/${orderId}`,
    },
    REVIEWS: {
        BASE: "/reviews",

        // Public
        BY_FOOD: (foodId: number) => `/reviews/foods/${foodId}`, // page, size gửi bằng params
        SUMMARY_BY_FOOD: (foodId: number) => `/reviews/foods/${foodId}/summary`,

        // User
        CREATE: `/reviews`,
        DELETE: (reviewId: number) => `/reviews/${reviewId}`,
        UPDATE: (reviewId: number) => `/reviews/${reviewId}`,
        MY_REVIEWS: `/reviews/my_reviews`, // page, size gửi bằng params

        // Admin
        BY_USER: (userId: number) => `/reviews/users/${userId}`, // page, size gửi bằng params
    },
};

// Frontend page routes
export const ROUTES = {
    // Public
    //home = foodpage
    HOME: "/", 
    CATEGORY: "/category",

    foodDetail: (id: number | string) => `/foods/${id}`,

    CHECKOUT: "/checkout",
    REVIEW: "/my_reviews",
    reviewDetail: (userId: number | string) => `/my_reviews/${userId}`,

    LOGIN: "/login",
    REGISTER: "/register",

    // User
    ORDERS: "/orders", // trang lịch sử đơn hàng user
    orderDetail: (id: number | string) => `/orders/${id}`,


    // Admin
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        FOODS: "/admin/foods",
        ORDERS: "/admin/orders",
        CATEGORIES: "/admin/categories",
        USERS: "/admin/users",
    },
};

export const ROUTE_PATTERNS = {
  FOOD_DETAIL: "/foods/:id",
  ORDER_DETAL: "/orders/:id",
  REVIEW_DETAIL: "my_reviews/:userId"
};


// Others
export const DEFAULT_PAGE_SIZE = 10;