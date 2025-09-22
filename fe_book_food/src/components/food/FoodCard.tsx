//hiển thị thong tin 1 món ăn ( ảnh + tên + giá)
import React from "react";

interface FoodCardProps {
    name: string;
    price: number;
    image: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ name, price, image }) => {
    return (
        <div className="card h-100 shadow-sm">
            <img
                src={image}
                alt={name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body text-center">
                <h5 className="card-title">{name}</h5>
                <p className="card-text text-danger fw-bold">{price.toLocaleString()} đ</p>
                <button className="btn btn-primary">Thêm vào giỏ</button>
            </div>
        </div>
    );
};

export default FoodCard;