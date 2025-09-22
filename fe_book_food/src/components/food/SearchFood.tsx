// src/components/food/SearchFood.tsx
import React, { useState } from "react";

const SearchFood: React.FC = () => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", keyword);
  };

  return (
    <form className="d-flex mb-4" onSubmit={handleSearch}>
      <input
        type="text"
        className="form-control me-2"
        placeholder="Tìm món ăn..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button className="btn btn-outline-success">Tìm</button>
    </form>
  );
};

export default SearchFood;
