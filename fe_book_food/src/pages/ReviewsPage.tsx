// src/pages/ReviewsTestPage.tsx
import React from "react";
import ReviewList from "../components/review/ReviewList";
import { useNavigate, useParams } from "react-router-dom";
import MyReviewList from "../components/review/MyReviewList";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

const ReviewsPage: React.FC = () => {

  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  
  // Nếu chưa login, redirect
  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN);  // Hoặc show message: return <p>Vui lòng đăng nhập để xem đánh giá của bạn.</p>;
    return null;
  }
  return (
    <div className="container mt-4">
      <h2>Đánh giá của tôi</h2>
      <MyReviewList pageSize={10}/>
    </div>
  );
};

export default ReviewsPage;
