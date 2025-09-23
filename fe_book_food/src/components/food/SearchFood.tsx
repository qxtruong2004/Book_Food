// src/components/food/SearchFood.tsx
import { on } from "events";
import React, { useEffect, useState } from "react";

interface SearchParams{
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface SearchFoodProps{
  onSearch: (params: SearchParams) => void;
  delay?: number;
}

const SearchFood: React.FC<SearchFoodProps> = ({onSearch, delay = 400}) => {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  // Debounce: mỗi khi input đổi, đợi delay ms rồi gọi onSearch
  useEffect(() =>{
    const t= setTimeout(() =>{
      const params: SearchParams = {
        keyword: keyword || undefined,
        minPrice,
        maxPrice,
      };
      onSearch(params);
    }, delay);
    return () => clearTimeout(t);
  }, [keyword, minPrice, maxPrice, delay, onSearch])

  return (
     <div className="row g-2 mb-3">
      <div className="col-md-6">
        <input
          className="form-control"
          placeholder="Tìm món ăn..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <input
          type="number"
          className="form-control"
          placeholder="Giá tối thiểu"
          onChange={(e) =>
            setMinPrice(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>
      <div className="col-md-3">
        <input
          type="number"
          className="form-control"
          placeholder="Giá tối đa"
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>
      {/* Nếu muốn dropdown danh mục:
      <div className="col-md-3">
        <select className="form-select" onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">Tất cả danh mục</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      */}
    </div>
  );
};

export default SearchFood;
