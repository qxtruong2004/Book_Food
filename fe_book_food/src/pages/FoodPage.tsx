// src/pages/FoodPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import FoodList from "../components/food/FoodList";
import { useFood } from "../hooks/useFood";
import { useSearchParams } from "react-router-dom";

const FoodPage: React.FC = () => {
  const {
    foods,
    loading,
    error,
    fetchAllFoods,
    searchResults,
    clearFoodSearchResults,
    searchFoods,
  } = useFood();

  const [hasFilter, setHasFilter] = useState(false);
  const [searchParams] = useSearchParams();

  // Mỗi khi ?keyword=... đổi -> quyết định gọi search hay fetch all
  useEffect(() => {
    const kw = (searchParams.get("keyword") || "").trim();

    if (kw) {
      setHasFilter(true);
      searchFoods({ keyword: kw, page: 0, size: 12 });
    } else {
      setHasFilter(false);
      fetchAllFoods();
      clearFoodSearchResults();
    }

    // Nếu các hàm trong useFood chưa được useCallback, có thể bật dòng dưới để tránh warning deps:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Nếu searchResults khác shape với FoodList, map về {id,name,price,image}
  const adaptedResults = useMemo(
    () =>
      (searchResults || []).map((f) => ({
        id: f.id,
        name: f.name,
        price: f.price,
        image: f.imageUrl,
      })),
    [searchResults]
  );

  if (loading) return <p>Đang tải món ăn...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const list = hasFilter ? adaptedResults : foods;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Thực đơn</h2>
      <FoodList foods={list} />
      {list.length === 0 && <p className="text-muted">Không có món ăn nào.</p>}
    </div>
  );
};

export default FoodPage;
