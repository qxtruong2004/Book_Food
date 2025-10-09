// src/components/category/CategoryTable.tsx
import React from "react";
import { CategoryResponse } from "../../../types/category";


interface Props {
  items: CategoryResponse[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const CategoryTable: React.FC<Props> = ({ items, selectedId, onSelect }) => {
  return (
    <div className="border rounded-3 bg-white shadow-sm" style={{ minHeight: 320, overflow: "hidden" }}>
      <div className="table-responsive" style={{ height: "100%" }}>
        <table className="table table-sm mb-0 align-middle" style={{ height: "100%" }}>
          <thead className="table-light" style={{
            background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)",
            borderBottom: "2px solid #c8e6c9"
          }}>
            <tr>
              <th style={{ width: 140, color: "#2e7d32", fontWeight: "600", padding: "16px 12px" }}>
                <i className="fas fa-hashtag me-1"></i> Mã danh mục
              </th>
              <th style={{ width: 260, color: "#2e7d32", fontWeight: "600", padding: "16px 12px" }}>
                <i className="fas fa-tag me-1"></i> Tên danh mục
              </th>
              <th style={{ color: "#2e7d32", fontWeight: "600", padding: "16px 12px" }}>
                <i className="fas fa-align-left me-1"></i> Mô tả
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "#fafafa" }}>
            {!items.length ? (
              <tr>
                <td colSpan={3} className="text-center text-muted py-5" style={{
                  color: "#9e9e9e",
                  fontSize: "1.1rem",
                  verticalAlign: "middle"
                }}>
                  <i className="fas fa-folder-open fa-2x mb-2 d-block" style={{ color: "#c8e6c9" }}></i>
                  Chưa có danh mục nào. Hãy thêm mới để bắt đầu!
                </td>
              </tr>
            ) : items.map(c => (
              <tr
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`align-middle ${selectedId === c.id ? "table-success" : ""}`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderBottom: "1px solid #f1f8e9"
                }}
              >
                <td className="fw-semibold text-success" style={{ padding: "12px", color: "#4caf50" }}>
                  {c.id}
                </td>
                <td style={{ padding: "12px" }}>
                  <span className="fw-medium" style={{ color: "#2e7d32" }}>{c.name}</span>
                </td>
                <td style={{
                  padding: "12px",
                  maxWidth: 420,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "#616161"
                }}
                  title={c.description || "Không có mô tả"}
                >
                  {c.description || <span className="text-muted">Không có mô tả</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(CategoryTable);
