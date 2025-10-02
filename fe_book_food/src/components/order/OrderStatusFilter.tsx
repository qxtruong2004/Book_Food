import { ORDER_STATUS_LABEL, OrderStatus } from "../../types/order"

type Props = {
    value: OrderStatus | "ALL";
    onChange: (v: OrderStatus | "ALL") => void;
};

const STATUSES: (OrderStatus | "ALL")[] = ["ALL", OrderStatus.PENDING, OrderStatus.FAILED, OrderStatus.PREPARING, OrderStatus.SUCCEEDED];

export default function OrderStatusFilter({value, onChange}: Props){
    return(
         <div className="d-flex gap-2 flex-wrap mb-3">
            {STATUSES.map((s) => (
                <button key={s} className={`btn btn-sm ${value === s ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => onChange(s)}
                >
                {s === "ALL" ? "Tất cả" : ORDER_STATUS_LABEL[s as OrderStatus]}
                </button>
            ))}
         </div>
    )
}