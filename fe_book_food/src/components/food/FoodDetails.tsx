// src/components/food/FoodDetails.tsx
import React from "react";
import AddToDraftButton from "./AddToDraftButton";
import { formatCurrency, formatSoldCount } from "../../utils/helpers";

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
  soldCount: number;
}

const FoodDetails: React.FC<FoodDetailsProps> = ({
  id, name, description, price, imageUrl, isAvailable, preparationTime, rating, categoryName, soldCount
}) => {
  return (
    <div className="card shadow p-4">
      <div className="row g-4 align-items-start">
        {/* LEFT: Ảnh (1/2 màn hình) */}
        <div className="col-12 col-md-6">
          <div className="border rounded overflow-hidden h-100">
            <img
              src={imageUrl}
              alt={name}
              className="img-fluid w-100"
              style={{
                objectFit: "cover",
                aspectRatio: "1 / 1",     // vuông đẹp; trên trình duyệt cũ vẫn ok vì có height auto
                maxHeight: 520
              }}
            />
          </div>
        </div>

        {/* RIGHT: Thông tin (1/2 màn hình) */}
        <div className="col-12 col-md-6">
          <h2 className="mb-2">{name}</h2>

          <div className="mb-3">
            <span className="fs-4 text-danger fw-bold">
              {formatCurrency(price)}
            </span>
          </div>

          <p className="text-muted">{description}</p>

          <ul className="list-unstyled mt-3 small">
            <li className="mb-1">
              <strong>Danh mục:</strong> <span className="badge text-bg-secondary">{categoryName}</span>
            </li>
            <li className="mb-1">
              <strong>Tình trạng: </strong>
              {isAvailable
                ? <span className="badge text-bg-success">Còn hàng</span>
                : <span className="badge text-bg-danger">Hết hàng</span>}
            </li>
            <li className="mb-1">
              <strong>Thời gian chế biến:</strong> {preparationTime} phút
            </li>
            <li className="mb-1">
              <strong>Đã bán:</strong> {formatSoldCount(soldCount)}
            </li>
            <li className="mb-1">
              <strong>Đánh giá:</strong> ⭐ {rating.toFixed(1)}/5
            </li>
          </ul>

          {isAvailable ? (
            <div className="mt-3">
              <AddToDraftButton foodId={id} foodName={name} price={price} />
            </div>
          ) : (
            <button className="btn btn-secondary mt-3" disabled>Hết hàng</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
