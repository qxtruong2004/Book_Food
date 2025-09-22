// src/pages/FoodPage.tsx
import React, { useState } from "react";
import SearchFood from "../components/food/SearchFood";
import FoodList from "../components/food/FoodList";

const FoodPage: React.FC = () => {
  // Mock dữ liệu món ăn
  const allFoods = [
    { id: 1, name: "Pizza Bò", price: 100000, image: "https://picsum.photos/400/200?random=10" },
    { id: 2, name: "Gà Rán", price: 80000, image: "https://picsum.photos/400/200?random=11" },
    { id: 3, name: "Mì Ý", price: 90000, image: "https://picsum.photos/400/200?random=12" },
    { id: 4, name: "Sushi Cá Hồi", price: 150000, image: "https://picsum.photos/400/200?random=13" },
    { id: 5, name: "Bánh Mì Việt Nam", price: 30000, image: "https://picsum.photos/400/200?random=14" },
  ];

  const [foods, setFoods] = useState(allFoods);

  // Xử lý tìm kiếm
  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setFoods(allFoods); // nếu ô tìm kiếm trống → hiện tất cả
    } else {
      setFoods(
        allFoods.filter((food) =>
          food.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Thực đơn</h2>

      {/* Thanh tìm kiếm */}
      {/* <SearchFood onSearch={handleSearch} /> */}

      {/* Danh sách món ăn */}
      <FoodList foods={foods} />

      {/* Nếu không tìm thấy */}
      {foods.length === 0 && <p className="text-muted">Không tìm thấy món ăn nào.</p>}
    </div>
  );
};

export default FoodPage;
