// src/components/food/FoodList.tsx
import React from "react";
import FoodCard from "./FoodCard";

interface Food {
  id: number;
  name: string;
  price: number;
  image: string; // nếu bạn dùng imageUrl, đổi tên ở đây cho khớp
}

interface FoodListProps {
  foods: Food[];
}

const FoodList: React.FC<FoodListProps> = ({ foods }) => {
  return (
    <div className="row">
      {foods.map((food) => (
        <div key={food.id} className="col-md-4 mb-4">
          <FoodCard id={food.id} name={food.name} price={food.price} image={food.image} />
        </div>
      ))}
    </div>
  );
};

export default FoodList;
