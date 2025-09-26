// src/components/food/AddToDraftButton.tsx
import React, { useState, useMemo } from "react";
import { useOrderDraft } from "../../context/OrderDraftContext";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { toast } from "react-toastify";

/*useMemo dùng để ghi nhớ (memoize) kết quả của một phép tính thuần (không có side-effect) 
và chỉ tính lại khi phụ thuộc (deps) đổi. 
Nhờ vậy bạn tránh tính toán lại tốn kém và/hoặc giữ tham chiếu ổn định cho object/array 
để ngăn re-render không cần thiết. */

type Props = {
  foodId: number;
  foodName: string;   // ✅
  price?: number;     // (tuỳ chọn)
  min?: number;
  max?: number;
};

export default function AddToDraftButton({ foodId, foodName, price, min = 1, max = 99 }: Props) {
  const { addWithName } = useOrderDraft(); // Lấy hàm thêm vào giỏ từ context
  const [qty, setQty] = useState(min);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); //lấy URL hiện tại (path + query + hash)
  //Tạo một id ổn định cho cặp label/input:
  const inputId = useMemo(() => `qty-${foodId}`, [foodId]);

  function clamp(n: number) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  const dec = () => setQty((q) => clamp(q - 1));
  const inc = () => setQty((q) => clamp(q + 1));

  //xử lý khi người dùng gõ vào input (người dùng set số lượng món)
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = parseInt(e.target.value.replace(/[^\d]/g, ""), 10);
    setQty(clamp(Number.isNaN(v) ? min : v));
  };

  //xử lý thêm vào đơn
  const handleAdd = () => {
    if (!isAuthenticated) {
      //chưa đăng nhập -> điều hướng tới login, kèm đường dẫn để quay lại
      const redirectTo = location.pathname + location.search + location.hash;
      navigate(ROUTES.LOGIN, { state: { redirectTo, msg: "Vui lòng đăng nhập để sử dụng chức năng này" } })
      return;
    }
    addWithName(foodId, foodName, qty, price); // <-- 2) Gọi ở đây
    toast.success("🎉 Thêm vào giỏ hàng thành công", {
      position: "top-center",
      autoClose: 1000, // tự tắt sau 2 giây
    });
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <label htmlFor={inputId} className="form-label m-0">
        Chọn số lượng:
      </label>

      <div className="input-group" style={{ width: 170 }}>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={dec}
          aria-label="Giảm số lượng"
          title="Giảm"
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={min}
          max={max}
          step={1}
          value={qty}
          onChange={onChange}
          className="form-control text-center no-spinner"
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={inc}
          aria-label="Tăng số lượng"
          title="Tăng"
        >
          +
        </button>
      </div>

      <button className="btn btn-success" onClick={handleAdd}>
        Thêm vào đơn
      </button>
    </div>
  );
}
