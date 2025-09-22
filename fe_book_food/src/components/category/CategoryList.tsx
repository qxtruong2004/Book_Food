// src/components/category/CategoryList.tsx
import React from "react";
import CategoryCard from "./CategoryCard";

interface Category {
  id: number;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  onSelectCategory?: (id: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="row">
      {categories.map((cat) => (
        <div key={cat.id} className="col-6 col-md-3 mb-3">
          <CategoryCard
            name={cat.name}
            onClick={() => onSelectCategory && onSelectCategory(cat.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
