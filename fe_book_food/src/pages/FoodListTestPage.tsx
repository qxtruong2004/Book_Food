import FoodList from "../components/food/FoodList";

const FoodListTestPage = () => {
  const mockFoods = [
    { id: 1, name: "Pizza Bò", price: 100000, image: "https://picsum.photos/400/200?random=2" },
    { id: 2, name: "Gà Rán", price: 80000, image: "https://picsum.photos/400/200?random=3" },
    { id: 3, name: "Mì Ý", price: 90000, image: "https://picsum.photos/400/200?random=4" },
  ];

  return (
    <div className="container mt-4">
      <h2>Test FoodList</h2>
      <FoodList foods={mockFoods} />
    </div>
  );
};

export default FoodListTestPage;
