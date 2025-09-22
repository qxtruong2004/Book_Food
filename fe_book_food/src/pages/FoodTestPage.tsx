import FoodCard from "../components/food/FoodCard";

const FoodTestPage = () => {
  return (
    <div className="container mt-4">
      <h2>Test FoodCard</h2>
      <FoodCard
        name="Pizza Hải sản"
        price={120000}
        image="https://picsum.photos/400/200?random=1"
      />
    </div>
  );
};

export default FoodTestPage;