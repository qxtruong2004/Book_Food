import FoodDetails from "../components/food/FoodDetails";

const FoodDetailsTestPage = () => {
  return (
    <div className="container mt-4">
      <FoodDetails
        name="Pizza Hải sản"
        description="Pizza thơm ngon với tôm, mực, phô mai mozzarella."
        price={150000}
        image="https://picsum.photos/600/300?random=5"
      />
    </div>
  );
};

export default FoodDetailsTestPage;
