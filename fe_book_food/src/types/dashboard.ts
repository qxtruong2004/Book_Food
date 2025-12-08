export interface DashBoardRevenue{
    totalRevenue: number;
    revenueSucceeded: number;
    revenueWaiting: number;
}

export interface DashBoardOrder{
    totalOrders: number;
    totalSucceededOrders: number;
    totalPending: number;
    totalFailed: number;
    totalPreparing: number;
}

export interface BestSellerFood{
    foodId: number;
    foodName: String;
    quantitySold: number;
    categoryName: String;
}

export interface DashBoardFood{
    totalFoodsSold: number;
    topFoods: BestSellerFood[];
}

export interface ByRange{
    startDate: String;
    endDate: String;
}

export interface DashBoard{
    orderStats: DashBoardOrder;
    revenueStats: DashBoardRevenue;
    foodStats: DashBoardFood;
}