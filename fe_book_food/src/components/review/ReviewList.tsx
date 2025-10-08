// src/components/review/ReviewList.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReviewCard from "./ReviewCard";
import { useReview } from "../../hooks/useReview";
import { formatDateTime } from "../../utils/helpers";

type Props = {
  foodId: number;
  pageSize?: number; //mặc định là 10
}

const ReviewList: React.FC<Props> = ({foodId, pageSize = 10}) =>{
  const{foodReviews, loading, error, totalPages, currentPage, getReviewsByFoodId } = useReview();

  //tải trang đầu tiên khi đổi món
  useEffect(() =>{
    //Kiểm tra foodId có phải là số hữu hạn không( ví dụ nhập foodId = abc thì kh hợp lệ)
    if(Number.isFinite(foodId)){
      getReviewsByFoodId(foodId, 0, pageSize);
    }
  }, [foodId, pageSize, getReviewsByFoodId])

  //tính xem còn trang phía sau kh
  const hasMore = useMemo( //. Trả true nếu còn page sau để load more, false nếu hết (tránh gọi API vô ích).
    () => (typeof totalPages === "number" ? currentPage < totalPages - 1 : false), [currentPage, totalPages]
    /**Ví dụ: totalPages = 3 (có page 0,1,2).
      currentPage = 0 → 0 < 2 → true (còn 2 page sau).
      currentPage = 1 → 1 < 2 → true (còn 1 page sau).
      currentPage = 2 → 2 < 2 → false (hết, không load more). */
  )

  //tải trang tiếp theo
  const loadMore = useCallback(() =>{
    if(hasMore){
      getReviewsByFoodId(foodId, currentPage + 1, pageSize);
    }
  }, [hasMore, getReviewsByFoodId, currentPage, pageSize, foodId]);

  return(
    <div>
      {/* trạng thái */}
      {error && <p className="text-danger">Lỗi: {error}</p>}
      {!loading && (!foodReviews || foodReviews.length === 0) && (
        <p>Chưa có đánh giá nào cho món này</p>
      )}

      {/* danh sách review */}
      <div>
        {foodReviews?.map((r) => (
          <ReviewCard
            key={r.id}
            //id= {r.id} Nếu sau này có nút Sửa/Xoá, lúc đó bổ sung id (hoặc callback onEdit(id), onDelete(id))
            username={r.username}
            rating={r.rating}
            comment={r.comment ?? ""}
            date={formatDateTime(r.createdAt)}
          />
        ))}
      </div>

      {/* phân trang tải thêm */}
      <div className="d-flex justify-content-center my-3">
        {loading? (
          <button className="btn btn-outline-secondary" disabled>Đang tải..</button>
        ): hasMore? (
          <button className="btn btn-outline-primary" onClick={loadMore}>Tải thêm</button>
        ): (
          foodReviews?.length > 0 && (
            <small className="text-muted">Đã hiển thị tất cả</small>
          )
        )}
      </div>
    </div>
  )
}
export default ReviewList;
