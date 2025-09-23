
import React, { useEffect, useState } from "react";
import CategoryList from "../components/category/CategoryList";
import { useCategory } from "../hooks/useCategory";
import { useFood } from "../hooks/useFood";
import FoodList from "../components/food/FoodList";

const CategoryPage: React.FC = () => {
  const { categories, getAllCategories } = useCategory();
  const { categoryFoods, loading, error, fetchFoodsByCategory } = useFood();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);
  
  if (loading) return <p>Đang tải danh mục...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const handleSelectCategory = (id: number) => {
    setSelectedCategory(id);
    fetchFoodsByCategory(id);
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh mục món ăn</h2>
      <CategoryList
        categories={categories}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory} // 👈 truyền xuống
      />
      {selectedCategory && (
        <>
          <h4 className="mt-4">Món ăn thuộc danh mục</h4>
          {loading && <p>Đang tải món ăn...</p>}
          {error && <p className="text-danger">{error}</p>}

          <FoodList foods={categoryFoods} />
        </>
      )}
    </div>
  );
};

export default CategoryPage;
