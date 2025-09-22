// src/components/review/ReviewCard.tsx
import React from "react";

interface ReviewCardProps {
  username: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ username, rating, comment, date }) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h6 className="mb-1">{username}</h6>
          <small className="text-muted">{date}</small>
        </div>

        {/* Hiển thị sao */}
        <div className="mb-2">
          {"★".repeat(rating)}{"☆".repeat(5 - rating)}
        </div>

        <p className="mb-0">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
