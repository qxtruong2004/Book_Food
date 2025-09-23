// src/components/category/CategoryCard.tsx
import React from "react";

interface CategoryCardProps {
  name: string;
  onClick?: () => void;
  isSelected?: boolean; // 👈 thêm vào
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, onClick, isSelected }) => {
  return (
    <div
    className={`p-3 border rounded text-center shadow-sm ${isSelected ? "bg-primary text-white" : "bg-light"}`}

      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <h6 className="mb-0">{name}</h6>
    </div>
  );
};

export default CategoryCard;
