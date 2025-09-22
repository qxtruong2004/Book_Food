// src/components/food/FoodDetails.tsx
import React from "react";

interface FoodDetailsProps {
  name: string;
  description: string;
  price: number;
  image: string;
}

const FoodDetails: React.FC<FoodDetailsProps> = ({ name, description, price, image }) => {
  return (
    <div className="card shadow p-4">
      <img
        src={image}
        alt={name}
        className="card-img-top mb-3"
        style={{ maxHeight: "300px", objectFit: "cover" }}
      />
      <h2>{name}</h2>
      <p className="text-muted">{description}</p>
      <h4 className="text-danger fw-bold">{price.toLocaleString()} đ</h4>
      <button className="btn btn-success mt-3">Thêm vào giỏ</button>
    </div>
  );
};

export default FoodDetails;
