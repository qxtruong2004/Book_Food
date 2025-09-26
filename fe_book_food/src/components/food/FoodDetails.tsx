// src/components/food/FoodDetails.tsx
import React from "react";
import AddToDraftButton from "./AddToDraftButton";


interface FoodDetailsProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime: number;
  rating: number;
  categoryName: string;
}
const FoodDetails: React.FC<FoodDetailsProps> = ({
  id, name, description, price, imageUrl, isAvailable, preparationTime, rating, categoryName
}) => {
  return (
    <div className="card shadow p-4">
      <img
        src={imageUrl}
        alt={name}
        className="card-img-top mb-3"
        style={{ maxHeight: "300px", objectFit: "cover" }}
      />
      <h2>{name}</h2>
      <p className="text-muted">{description}</p>
      <h4 className="text-danger fw-bold">{price.toLocaleString()} đ</h4>

      <ul className="list-unstyled mt-3">
        <li><strong>Danh mục:</strong> {categoryName}</li>
        <li><strong>Thời gian chế biến:</strong> {preparationTime} phút</li>
        <li>
          <strong>Tình trạng:</strong>{" "}
          {isAvailable ? <span className="text-success">Còn hàng</span> : <span className="text-danger">Hết hàng</span>}
        </li>
        <li><strong>Đánh giá:</strong> ⭐ {rating.toFixed(1)}/5</li>
      </ul>

      {/* ✅ Nút thêm vào đơn */}
      {isAvailable ? (
         <div className="mt-3">
          {/* ✅ Truyền tên và giá để lưu vào draft */}
          <AddToDraftButton foodId={id} foodName={name} price={price} />
        </div>
      ) : (
        <button className="btn btn-secondary mt-3" disabled>Hết hàng</button>
      )}
    </div>
  );
};

export default FoodDetails;
