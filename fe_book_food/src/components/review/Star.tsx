// Stars.tsx — integer-only, no half-star
import React, { useState } from "react";

export function Stars({
  value,
  onChange,
  readOnly = false,
  min = 1,
  max = 5
}: {
  value: number;                 // kỳ vọng số nguyên 1..5
  onChange?: (v: number) => void; // callback khi user chọn sao n
  readOnly?: boolean;             // true => chỉ xem, không click/hover
  min?: number;                  // mặc định 1
  max?: number;                  // mặc định 5
}) {
  // hoverState để preview khi rê chuột (chỉ khi không readOnly)
  const [hover, setHover] = useState<number | null>(null);

  // đảm bảo value luôn nằm trong khoảng và là số nguyên
  const clamped = Math.max(min, Math.min(max, Math.floor(value)));

  const active = hover ?? clamped;

  return (
    <div className="d-flex align-items-center" style={{ gap: 6 }}>
      {/* tạo mảng vs 5 sao */}
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const filled = n <= active; //quyết định sao đầy (vàng) hay trống (xám)
        return (
          <span
            key={n}
            role={readOnly ? "img" : "button"}
            aria-label={`${n} sao`}
            title={`${n} sao`}
            onClick={() => !readOnly && onChange?.(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(null)}
            style={{
              fontSize: 22,
              lineHeight: 1,
              cursor: readOnly ? "default" : "pointer",
              userSelect: "none",
              color: filled ? "#f5a623" : "#ccc",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
