// src/components/food/FoodList.tsx
import React from "react";
import FoodCard from "./FoodCard";
import { FoodResponse} from "../../types/food";  // Import Page
import { Page } from "../../types/page";


interface FoodListProps {
  foods: Page<FoodResponse> | FoodResponse[] | null;  // THÊM: Hỗ trợ union type (Page hoặc array)
}

const FoodList: React.FC<FoodListProps> = ({ foods }) => {
  // Helper: Extract content array từ Page hoặc dùng trực tiếp
  const getContent = (): FoodResponse[] => {
    if (!foods) return [];
    if (Array.isArray(foods)) return foods;  // Nếu là array → dùng trực tiếp
    return foods.content || [];  // Nếu Page → lấy content
  };

  const content = getContent();

  // Handle empty: Không render nếu rỗng
  if (content.length === 0) {
    return null;  // Hoặc <div>Không có món ăn</div> nếu muốn empty state
  }

  return (
    <div className="row">
      {content.map((food) => (
        <div key={food.id} className="col-md-4 mb-4">
          <FoodCard 
            id={food.id} 
            name={food.name} 
            price={food.price} 
            imageUrl={food.imageUrl}  // Adapt field nếu cần (imageUrl từ backend)
          />
        </div>
      ))}
    </div>
  );
};

export default FoodList;