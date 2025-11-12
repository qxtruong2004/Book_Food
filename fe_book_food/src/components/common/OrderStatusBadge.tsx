import React from "react";
import { ORDER_STATUS_LABEL } from "../../types/order";
import { OrderStatus } from "../../types/order";

interface Props {
    status: OrderStatus;
}

const OrderStatusBadge: React.FC<Props> = ({ status }) => {

    const bootstrapColors: Record<OrderStatus, string> = {
        PENDING: "bg-warning text-dark",
        PREPARING: "bg-primary",
        SUCCEEDED: "bg-success",
        FAILED: "bg-danger",
    };

    return (
        <span className={`badge ${bootstrapColors[status]}`}>
            {ORDER_STATUS_LABEL[status]}
        </span>
    );


};

export default OrderStatusBadge;
