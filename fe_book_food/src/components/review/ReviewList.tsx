// src/components/review/ReviewList.tsx
import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, username: "Nguyễn Văn A", rating: 5, comment: "Rất ngon, sẽ quay lại!", date: "2025-09-15" },
    { id: 2, username: "Trần Thị B", rating: 4, comment: "Ổn nhưng hơi mặn.", date: "2025-09-16" },
  ]);

  const handleAddReview = (review: { rating: number; comment: string }) => {
    const newReview: Review = {
      id: reviews.length + 1,
      username: "Khách hàng ẩn danh",
      rating: review.rating,
      comment: review.comment,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([newReview, ...reviews]);
  };

  return (
    <div>
      <ReviewForm onSubmit={handleAddReview} />
      {reviews.map((r) => (
        <ReviewCard key={r.id} {...r} />
      ))}
    </div>
  );
};

export default ReviewList;
