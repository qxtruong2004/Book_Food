export interface Page<T> {
  content: T[];          // dữ liệu chính
  totalPages: number;    // tổng số trang
  totalElements: number; // tổng số phần tử
  size: number;          // số phần tử mỗi trang
  number: number;        // trang hiện tại (0-based)
  first: boolean;        // có phải trang đầu không
  last: boolean;         // có phải trang cuối không
  empty: boolean;        // có trống không
}