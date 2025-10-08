

// === Response đúng theo backend hiện tại ===
export interface ReviewResponse {
  id: number;
  username: string;     // backend trả username, không trả object user
  rating: number;       // BigDecimal -> number
  comment?: string;     // cho phép rỗng
  createdAt: string;    // LocalDateTime -> string ISO
}

// === Request khi tạo/sửa review ===
export interface CreateReviewRequest {
  foodId: number;
  rating: number;       // 1..5
  orderId: number;      // nếu backend yêu cầu "đã mua mới được review"
  comment?: string;
}

export interface UpdateReviewRequest {
  comment?: string;
  rating?: number;
}

// === Tóm tắt/summary cho 1 món ăn ===
export interface FoodRatingSummaryResponse {
  averageRating: number;
  totalReviews: number;
  // gợi ý thêm:
  // countsByStar?: { [star in 1|2|3|4|5]?: number };
}