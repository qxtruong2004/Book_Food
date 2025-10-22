import React from "react";
import { FoodResponse } from "../../../types/food";
import { formatCurrency } from "../../../utils/helpers";

interface Props {
  data: FoodResponse[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const FoodTable: React.FC<Props> = ({ data, selectedId, onSelect }) => {
  return (
    <div className="border rounded-3 bg-white shadow-sm" style={{ minHeight: 320, overflow: "hidden" }}>
      <div className="table-responsive">
        <table  className="table table-sm mb-0 align-middle"
                    style={{ height: "100%" }}>

          <thead
            className="table-light sticky-top"
            style={{ top: 0, background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)", borderBottom: "2px solid #c8e6c9", textAlign: 'center' }}
          >
            <tr>
              <th style={{ color: "#2e7d32",width: 30, fontWeight: 600, padding: "16px 12px" }}>
                <i className="fas fa-hashtag me-1" /> ID
              </th>
              <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                <i className="fas fa-tag me-1" /> Món ăn
              </th>
              <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                <i className="fas fa-coins me-1" /> Giá bán
              </th>
              <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                <i className="fas fa-toggle-on me-1" /> Trạng thái
              </th>
              <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                <i className="fas fa-clock me-1" /> Time chế biến
              </th>
              <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                Đánh giá
              </th>
              <th style={{ color: "#2e7d32", width: 80, fontWeight: 600, padding: "16px 12px" }}>
                <i className="fas fa-list me-1" /> Danh mục
              </th>
              <th style={{ color: "#2e7d32", width: 70, fontWeight: 600, padding: "16px 12px" }}>
                <i className="fas fa-shopping-bag me-1" /> Đã bán
              </th>
            </tr>
          </thead>

          <tbody style={{textAlign: 'center'}}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">Chưa có dữ liệu</td>
              </tr>
            ) : (
              data.map((f) => {
                const isActive = f.id === selectedId;
                return (
                  <tr
                    key={f.id}
                    className={isActive ? "table-success" : ""}
                    style={{ cursor: "pointer" }}
                    onClick={() => onSelect(f.id)}
                  >
                    <td className="fw-semibold">#{f.id}</td>

                    {/* Thumbnail + Name */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={f.imageUrl}
                          alt={f.name}
                          width={60}
                          height={60}
                          style={{ objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/no-image.png";
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="text-truncate" title={f.name} style={{ minWidth: 0 }}>
                          {f.name}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="fw-semibold">{formatCurrency(f.price)}</td>

                    {/* IsAvailable */}
                    <td>
                      <span className={`badge ${f.isAvailable ? "bg-success" : "bg-secondary"}`}>
                        {f.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    {/* PreparationTime */}
                    <td>{f.preparationTime ?? "—"}</td>

                    {/* Rating */}
                    <td>{f.rating ? `${f.rating.toFixed(1)} ★` : "—"}</td>

                    {/* Category */}
                    <td className="text-truncate" title={f.category.name ?? ""}>{f.category.name ?? "—"}</td>

                    {/* SoldCount */}
                    <td>{f.soldCount ?? 0}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(FoodTable);
