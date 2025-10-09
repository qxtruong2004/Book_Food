import React from "react";

export type Column<T> = {
    key: string;
    header: React.ReactNode; //tiêu đề cột
    //hàm tùy chọn để render nội dung ô nhân row:T và trả về ReactNode
    accessor?: (row: T) => React.ReactNode;
    width?: number | string;
    align?: "left" | "center" | "right";
    className?: string;
}

export type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    getRowId: (row: T) => React.Key; //ID duy nhất cho mỗi row
    selectedId?: React.Key | null; //ID row đang được chọn (highlight)
    onSelect?: (id: React.Key, row: T) => void; //Callback khi click row (nếu có, row sẽ clickable).
    loading?: boolean;
    emptyText?: string; //text hiển thị khi kh có data

    // optional phân trang
    page?: number;                  // 0-based
    pageSize?: number;
    total?: number;
    onPageChange?: (nextPage: number) => void;

    tableMinHeight?: number;        // để giữ khung giống design
}

export default function DataTable<T>({columns, data, getRowId, selectedId, onSelect, loading, emptyText = "Chưa có dữ liệu.",
  page, pageSize, total, onPageChange, tableMinHeight = 320,}: DataTableProps<T>){
    const showPagination = typeof page === "number"
    && typeof pageSize === "number"
    && typeof total === "number"
    && typeof onPageChange === "function";

  const totalPages = showPagination ? Math.max(1, Math.ceil(total! / pageSize!)) : 1;

  return (
    <div className="border rounded bg-white">
      <div className="table-responsive" style={{ minHeight: tableMinHeight }}>
        <table className="table table-sm mb-0 align-middle">
          <thead className="table-light">
            <tr>
              {columns.map(col => (
                <th key={col.key}
                    style={{ width: col.width }}
                    className={col.className ?? (col.align === "right" ? "text-end" : col.align === "center" ? "text-center" : "")}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="py-4 text-center text-muted">Đang tải dữ liệu…</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="py-4 text-center text-muted">{emptyText}</td></tr>
            ) : (
              data.map(row => {
                const id = getRowId(row);
                const isSelected = selectedId === id;
                return (
                  <tr key={id}
                      onClick={() => onSelect?.(id, row)}
                      style={{ cursor: onSelect ? "pointer" : "default", background: isSelected ? "#eef9f0" : undefined }}>
                    {columns.map(col => {
                      const content = col.accessor
                        ? col.accessor(row)
                        // @ts-ignore – fallback đọc thuộc tính thẳng: (row as any)[col.key]
                        : (row as any)[col.key];
                      const alignClass = col.className ?? (col.align === "right" ? "text-end" : col.align === "center" ? "text-center" : "");
                      return <td key={col.key} className={alignClass}>{content}</td>;
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="small text-muted">
            Trang {page! + 1}/{totalPages} • {total} bản ghi
          </div>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-secondary"
              onClick={() => onPageChange!(Math.max(0, page! - 1))}
              disabled={page! <= 0}>«</button>
            <button className="btn btn-sm btn-outline-secondary"
              onClick={() => onPageChange!(Math.min(totalPages - 1, page! + 1))}
              disabled={page! >= totalPages - 1}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}
