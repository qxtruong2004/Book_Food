import { useCallback, useEffect, useMemo } from "react";
import { useReview } from "../../hooks/useReview";
import ReviewCard from "./ReviewCard";
import { formatDateTime } from "../../utils/helpers";
import ReviewList from "./ReviewList";
import { ReviewResponse } from "../../types/review";
import { Stars } from "./Star";

type Props = {
  pageSize?: number;
}

const MyReviewList: React.FC<Props> = ({ pageSize = 10 }) => {
  const { reviews, loading, error, getMyReviews } = useReview();

  useEffect(() => {
    console.log("useEffect triggered, calling getMyReviews");  // Log 1
    getMyReviews().then((data) => console.log("Data from hook:", data))  // Log 2: Array 6 items?
      .catch((err) => console.error("Hook error:", err));  // Log 3: Nếu reject
  }, [getMyReviews]);

  if (loading) return <p>Đang tải đánh giá của bạn...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (reviews.length === 0) return <p>Bạn chưa có đánh giá nào.</p>;


  return (
    <div>
      {/* danh sách review */}
      <section className="mt-4">
        <h5 className="mb-3">Đánh giá của bạn ({reviews.length})</h5>  {/* ✅ Customize header */}

        <ul className="list-unstyled">
          {reviews.map((r: ReviewResponse) => (  // ✅ Map và render inline
            <li key={r.id} className="border-bottom py-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{r.username}</strong>  {/* Hoặc "Bạn" vì my reviews */}
                <small className="text-muted">
                  {formatDateTime(r.createdAt)}  {/* Format date */}
                </small>
              </div>
              <Stars value={r.rating} />  {/* Stars rating */}
              <p className="mb-0">{r.comment}</p>  {/* Comment */}
            </li>
          ))}
        </ul>
        {/* Không có loading thêm hoặc load more vì full list */}
      </section>
    </div>
  )
}

export default MyReviewList;