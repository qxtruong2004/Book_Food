
import { useMemo } from "react";

interface Props{
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    onChangePage: (nextPage: number) => void;
    onChangeSize?: (nextSize: number) => void;
    tieude: string;
}

function buildPageList(cur: number, total: number){
    //tạo mảng số trang
    const pages: (number | "...")[] = [];
    const add = (n: number | "...") => pages.push(n);

    const to1 = Math.max(1, cur - 1); //hiện trang hiện tại
    const to2 = Math.min(total, cur + 1+ 1);

    //nếu chỉ có 5 trang thì kh cần rút gọn
    if(total <= 5){
        for(let i = 1; i <= total; i++) add(i);
        return pages;
    }

    //luoonn hiện 1 và cuối
    add(1);
    if(to1 > 2) add("...");
    for(let i = to1; i <= to2; i++) add(i);
    if(to2 < total -1) add("...");
    add(total);
    return pages;
}

const AdminPagination: React.FC<Props> = ({
  page, size, totalPages, totalElements,tieude,
  onChangePage, onChangeSize
}) => {
  const pages = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);
  const isFirst = page === 0;
  const isLast = page + 1 >= totalPages;

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
      <div className="text-muted small">
        Tổng: <strong>{totalElements.toLocaleString()}</strong> {tieude} • Trang{" "}
        <strong>{totalPages === 0 ? 0 : page + 1}</strong>/<strong>{totalPages}</strong>
      </div>

      <div className="d-flex align-items-center gap-2">

        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${isFirst ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => !isFirst && onChangePage(page - 1)}>«</button>
            </li>

            {pages.map((p, i) =>
              p === "..." ? (
                <li key={`e-${i}`} className="page-item disabled"><span className="page-link">…</span></li>
              ) : (
                <li key={p} className={`page-item ${p === page + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => onChangePage((p as number) - 1)}>
                    {p}
                  </button>
                </li>
              )
            )}

            <li className={`page-item ${isLast ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => !isLast && onChangePage(page + 1)}>»</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminPagination;