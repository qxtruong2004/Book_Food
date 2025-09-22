// src/components/category/CategoryCard.tsx
import React from "react";

interface CategoryCardProps {
  name: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, onClick }) => {
  return (
    <div
      className="p-3 border rounded text-center bg-light shadow-sm"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <h6 className="mb-0">{name}</h6>
    </div>
  );
};

export default CategoryCard;
