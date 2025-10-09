import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { getDateRange } from "../../utils/dateRange";
import {
  ResponsiveContainer,
  LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from "recharts";

type OverviewResp = {
  todayOrders: number;
  todayRevenue: number;
  delivering: number;
  lowStock: number;
  series: Array<{ date: string; revenue: number; orders: number }>;
  topFoods: Array<{ name: string; sold: number }>;
};

function formatCurrency(v: number) {
  return (v ?? 0).toLocaleString("vi-VN") + " ₫";
}

export default function Dashboard() {
  // date range
  const [preset, setPreset] = useState<"7"|"30"|"custom">("7");
  const [from, setFrom] = useState(getDateRange(7).from);
  const [to, setTo]     = useState(getDateRange(7).to);

  const [data, setData] = useState<OverviewResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canLoad = useMemo(()=>{
    // đảm bảo from <= to
    return new Date(from) <= new Date(to);
  }, [from, to]);

  const fetchData = async () => {
    if (!canLoad) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get<OverviewResp>("/api/admin/analytics/overview", {
        params: { from, to }
      });
      setData(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // load khi đổi preset
  useEffect(() => {
    if (preset === "7" || preset === "30") {
      const r = getDateRange(Number(preset));
      setFrom(r.from);
      setTo(r.to);
    }
  }, [preset]);

  // load khi đổi range
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const [selectedDate, setSelectedDate] = useState("2025-10-08"); // Ngày hiện tại theo định dạng YYYY-MM-DD
  
     
  
      const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setSelectedDate(e.target.value);
      };

  return (
    
                <main className="flex-grow-1 p-3 overflow-auto">
                <div className="bg-light p-2 text-center border-bottom" style={{ backgroundColor: "#fff8e1" }}>
                    <label htmlFor="datePicker" className="form-label me-2 fw-semibold text-dark">Chọn ngày:</label>
                    <input
                        type="date"
                        id="datePicker"
                        className="form-control d-inline-block w-auto"
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={{ borderColor: "#ff9800", color: "#ff9800" }}
                    />
                    <small className="ms-2 text-muted">({new Date(selectedDate).toLocaleDateString('vi-VN')})</small>
                </div>
                    <div className="container-fluid">
                        {/* Tổng quan Cards */}
                        <div className="row mb-4">
                            <div className="col-md-3 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-success">Số lượng đơn hàng</h5>
                                        <h2 className="text-dark">5</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-success">Số lượng món đã bán</h5>
                                        <h2 className="text-dark">15</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-success">Đơn hàng hoàn thành</h5>
                                        <h2 className="text-dark">5</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-success">Đơn hàng chờ giao</h5>
                                        <h2 className="text-dark">5</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thống kê Doanh thu */}
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-success">Tổng doanh thu</h5>
                                        <h2 className="text-dark">3,000,000 VNĐ</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-success">Doanh thu chờ xác nhận</h5>
                                        <h2 className="text-dark">500,000 VNĐ</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-body text-center">
                                        <h5 className="card-title text-success">Doanh thu đã xác nhận</h5>
                                        <h2 className="text-dark">2,500,000 VNĐ</h2>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Bảng Đơn hàng */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm" style={{ backgroundColor: "#e8f5e8" }}>
                                    <div className="card-header bg-light" style={{ backgroundColor: "#f1f8e9" }}>
                                        <h5 className="mb-0 text-success">Top món ăn bán chạy</h5>
                                    </div>
                                    <div className="card-body p-0">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Mã Món Ăn</th>
                                                    <th>Tên món ăn</th>
                                                    <th>Danh mục</th>
                                                    <th>Giá bán</th>
                                                    <th>Số lượng đã bán</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Mì Ý</td>
                                                    <td><span className="badge bg-success">Mới</span></td>
                                                    <td>10,000 VNĐ</td>
                                                    <td>30</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </main>
  );
}
