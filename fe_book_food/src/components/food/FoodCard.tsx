// src/components/food/FoodCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import AddToDraftButton from "./AddToDraftButton";


interface FoodCardProps {
  id: number;
  name: string;
  price: number;
  image: string; // hoặc imageUrl nếu bạn đặt vậy ở BE
}

const FoodCard: React.FC<FoodCardProps> = ({ id, name, price, image}) => {
  return (
    <div className="card h-100 shadow-sm">
      <Link to={ROUTES.foodDetail(id)}>
        <img
          src={image}
          alt={name}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
        />
      </Link>

      <div className="card-body text-center">
        <Link to={ROUTES.foodDetail(id)} className="text-decoration-none">
          <h5 className="card-title mb-1">{name}</h5>
        </Link>
        <p className="card-text text-danger fw-bold mb-3">{price.toLocaleString()} đ</p>

        {/* ✅ Xem chi tiết món ăn */}
        <div className="d-flex gap-2 justify-content-center">
          <Link to={ROUTES.foodDetail(id)} className="btn btn-primary">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
