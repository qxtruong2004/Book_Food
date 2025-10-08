import { useParams } from "react-router-dom";
import FoodDetails from "../components/food/FoodDetails";
import { useFood } from "../hooks/useFood";
import { useEffect } from "react";
import ReviewList from "../components/review/ReviewList";

const FoodDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // lấy id từ URL
  const { currentFood, fetchFoodById, loading, error } = useFood();

  const foodId = Number(id);
  useEffect(() => {
    if (id) {
      fetchFoodById(Number(id)); //gọi API lấy món ăn theo id
    }
  }, [id, fetchFoodById]);
  if (loading) return <p>Đang tải chi tiết món ăn...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!currentFood) return <p className="text-muted">Không tìm thấy món ăn.</p>;

  return (
    <div className="container mt-4">
      <>
        <FoodDetails
          id={currentFood.id}
          name={currentFood.name}
          description={currentFood.description}
          price={currentFood.price}
          imageUrl={currentFood.imageUrl}
          isAvailable={currentFood.isAvailable}
          preparationTime={currentFood.preparationTime}
          rating={currentFood.rating}
          categoryName={currentFood.category?.name || "Không có"}
          soldCount={currentFood.soldCount}
        />
        <div className="container my-4">
          {/* ...thông tin món ăn */}
          <h4 className="mt-4 mb-3">Đánh giá</h4>
          {!Number.isNaN(foodId) && <ReviewList foodId={foodId} pageSize={10}/>}
        </div>

      </>
    </div>
  );
};

export default FoodDetailsPage;
