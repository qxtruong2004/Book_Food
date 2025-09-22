// src/components/review/ReviewForm.tsx
import React, { useState } from "react";

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment("");
    setRating(5);
  };

  return (
    <form className="card p-3 mb-3" onSubmit={handleSubmit}>
      <h6>Viết đánh giá của bạn</h6>

      <div className="mb-2">
        <label className="form-label">Số sao</label>
        <select
          className="form-select"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} ★
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">Nhận xét</label>
        <textarea
          className="form-control"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Hãy chia sẻ cảm nhận của bạn..."
        ></textarea>
      </div>

      <button type="submit" className="btn btn-success">
        Gửi đánh giá
      </button>
    </form>
  );
};

export default ReviewForm;
