//các hàm tiện ích dùng chung

export const saveToStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

export const getFromStorage = (key: string) : string | null  => {
    return localStorage.getItem(key);
}

export const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
};


        // lưu / lấy / xóa access & refresh token
export const setToken = (accessToken: string, refreshToken?: string) => {
    saveToStorage("accessToken", accessToken);
    if(refreshToken){
        saveToStorage("refreshToken", refreshToken);
    }
};

export const getAccessToken = () : string | null =>{
    return getFromStorage("accessToken");
}

export const getRefreshToken = () : string | null =>{
    return getFromStorage("refreshToken");
}

export const clearToken = () => {
    removeFromStorage("accessToken");
    removeFromStorage("refreshToken");
}

        // ----- Pagination Helpers: nhanh tạo query string cho API phân trang.
export const buildPaginationParams  = (page : number, size : number = 10) => {
    return `?page=${page}&size=${size}`
}

    // ----- String Helpers -----
export const encodeQueryParam = (param: string) => {
  return encodeURIComponent(param.trim());
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// ----- Date & Time Helpers: hiển thị ngày giờ cho UI.
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

// ----- Price Helpers: hiển thị tiền, tính giá sau giảm.
export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const calcDiscountPrice = (price: number, discountPercent: number) => {
  return price - (price * discountPercent) / 100;
};

// ----- Validation Helpers -----
export const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isPasswordStrong = (password: string) => {
  // Mật khẩu >= 8 ký tự, có ít nhất 1 chữ thường, 1 chữ hoa, 1 số
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

export const isPhoneValid = (phone: string) => {
  // Kiểm tra số điện thoại VN (10 số, bắt đầu bằng 0)
  return /^0\d{9}$/.test(phone);
};

// ----- Other Helpers -----
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 10);
};