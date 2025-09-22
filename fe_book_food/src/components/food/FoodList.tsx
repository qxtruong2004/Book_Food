// src/components/food/FoodList.tsx
import React from "react";
import FoodCard from "./FoodCard";

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface FoodListProps {
  foods: Food[];
}

const FoodList: React.FC<FoodListProps> = ({ foods }) => {
  return (
    <div className="row">
      {foods.map((food) => (
        <div key={food.id} className="col-md-4 mb-4">
          <FoodCard name={food.name} price={food.price} image={food.image} />
        </div>
      ))}
    </div>
  );
};

export default FoodList;
