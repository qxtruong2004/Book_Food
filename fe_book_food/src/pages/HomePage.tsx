// src/pages/HomePage.tsx
import React from "react";
import CategoryList from "../components/category/CategoryList";

const HomePage: React.FC = () => {
  const mockCategories = [
    { id: 1, name: "Pizza" },
    { id: 2, name: "Gà rán" },
    { id: 3, name: "Mì Ý" },
    { id: 4, name: "Đồ uống" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh mục</h2>
      <CategoryList
        categories={mockCategories}
        onSelectCategory={(id) => console.log("Chọn category:", id)}
      />
    </div>
  );
};

export default HomePage;
