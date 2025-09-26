// gom món tạm thời ở FE

import React, { createContext, useContext, useMemo, useState } from "react";
import type { DraftItem } from "../types/order";

//DraftCtx mô tả những gì context cung cấp cho component con:
type DraftCtx = {
  items: DraftItem[];                                // [{ foodId, quantity, foodName?, price? }]
  count: number;                                     // số món khác nhau
  addWithName: (foodId: number, name: string, qty?: number, price?: number) => void; // mới
  update: (foodId: number, qty: number) => void;
  remove: (foodId: number) => void;
  clear: () => void;
};

//tạo 1 context có giá trị mặc định null
const Ctx = createContext<DraftCtx | null>(null);

//nơi thật sự lưu state giỏ(Dùng children vì Provider là wrapper phải render phần con bên trong Context)
export const OrderDraftProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
 
  //Record<K, V> đối tượng có key kiểu K và value kiểu V., khởi tạo ban đầu là {}
  const [map, setMap] = useState<Record<number, { qty: number; name?: string; price?: number }>>({});

  

  //tăng số lượng và ghi tên/giá (nếu có)  
  const addWithName = (foodId: number, name: string, qty = 1, price?: number) =>
    setMap((s) => {
      const cur = s[foodId]?.qty ?? 0; //lấy sl hiện tại(Nếu món đã tồn tại: lấy qty hiện tại. Nếu chưa có: mặc định 0.)
      return {
        ...s, //giữ nguyên các món khác.
        /*nếu món đã thêm trc đó-> sau thêm tiếp thì cộng dồn */
        [foodId]: { qty: Math.max(1, cur + qty), name, price: price ?? s[foodId]?.price },
      };
    });

  //đặt lại số lượng tuyệt đối  
  const update = (foodId: number, qty: number) =>
    setMap((s) => {
      if (qty <= 0) { //qty <= 0: xoá món luôn khỏi giỏ
        const { [foodId]: _, ...rest } = s; //tách bỏ key động (foodId) khỏi object.
        return rest;
      }
      const cur = s[foodId];
      return { ...s, [foodId]: { qty, name: cur?.name, price: cur?.price } };
    });

  //Giống nhánh qty <= 0 ở update, nhưng đây là xoá trực tiếp không quan tâm số lượng.
  const remove = (foodId: number) =>
    setMap((s) => {
      const { [foodId]: _, ...rest } = s;
      return rest;
    });

  //Dùng khi người dùng bấm “Xoá hết” hoặc sau khi đặt hàng thành công.
  const clear = () => setMap({});

  // Chuyển map -> mảng DraftItem để render/submit
  /*
    Object.entries(map) trả về [[foodIdStr, {qty,name,price}], ...].
    map(...) biến từng entry thành một DraftItem có foodId , v = quantity, foodName, price.
    Bọc bằng useMemo để tránh tạo mảng mới mỗi render; chỉ khi map đổi thì items mới đổi.
    items là dạng thuận tiện cho: Render UI (liệt kê các món). Gửi lên API đặt hàng ([{foodId, quantity, ...}]).
    Vì state gốc là map nên items.length = số món khác nhau (distinct), phù hợp để hiển thị badge “số loại món”.
  */
  const items = useMemo<DraftItem[]>(
    () =>
      Object.entries(map).map(([id, v]) => ({
        foodId: Number(id),
        quantity: v.qty,
        foodName: v.name,
        price: v.price,
      })),
    [map]
  );

  const value: DraftCtx = {
    items,
    count: items.length,
    addWithName,
    update,
    remove,
    clear,
  };

  //Mọi component con “bên trong” OrderDraftProvider đều có thể useOrderDraft() để truy cập/ghi giỏ.
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useOrderDraft = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOrderDraft must be used within OrderDraftProvider");
  return v;
};
