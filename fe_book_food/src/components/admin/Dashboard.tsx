import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { getDateRange } from "../../utils/dateRange";
import {
    ResponsiveContainer,
    LineChart, Line,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from "recharts";
import { useOrder } from "../../hooks/useOrder";
import { formatCurrency } from "../../utils/helpers";
import { useDashBoard } from "../../hooks/useDashBoard";

type OverviewResp = {
    todayOrders: number;
    todayRevenue: number;
    delivering: number;
    lowStock: number;
    series: Array<{ date: string; revenue: number; orders: number }>;
    topFoods: Array<{ name: string; sold: number }>;
};

export default function Dashboard() {
    // date range
    const [preset, setPreset] = useState<"7" | "30" | "custom">("7");
    const [from, setFrom] = useState(getDateRange(7).from);
    const [to, setTo] = useState(getDateRange(7).to);

    const { dashboard, fetchDashBoard } = useDashBoard();
    const [data, setData] = useState<OverviewResp | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(() => {
    })

    const canLoad = useMemo(() => {
        // đảm bảo from <= to
        return new Date(from) <= new Date(to);
    }, [from, to]);


    // load khi đổi preset
    useEffect(() => {
        if (preset === "7" || preset === "30") {
            const r = getDateRange(Number(preset));
            setFrom(r.from);
            setTo(r.to);
        }
    }, [preset]);



    //tùy chọn ngày, ở đây ngày tùy chọn cũng chính là ngày để lọc đơn theo ngày
    const [selectedDate, setSelectedDate] = useState(() => {
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
    });


    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const { orders, totalRevenue, fetchTotalRevenue, fetchOrdersByDays } = useOrder();

    // load khi đổi ngày lọc
    useEffect(() => {
        fetchDashBoard(selectedDate, selectedDate)
    }, [selectedDate]);



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

            </div>
            <div className="container-fluid">
                {/* Tổng quan Cards */}
                <div className="row mb-7">
                    <div className="col-md mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Số lượng đơn</h6>
                                <h3 className="text-dark ">{dashboard?.orderStats.totalOrders}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Số món đã bán</h6>
                                <h3 className="text-dark ">{dashboard?.foodStats.totalFoodsSold}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Đơn hoàn thành</h6>
                                <h3 className="text-dark ">{dashboard?.orderStats.totalSucceededOrders}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Đơn chuẩn bị</h6>
                                <h3 className="text-dark ">{dashboard?.orderStats.totalPending}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Đơn chờ giao</h6>
                                <h3 className="text-dark ">{dashboard?.orderStats.totalPreparing}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Đơn bị hủy</h6>
                                <h3 className="text-dark ">{dashboard?.orderStats.totalFailed}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thống kê Doanh thu */}
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Tổng doanh thu</h6>
                                <h3 className="text-dark">{formatCurrency(dashboard?.revenueStats.totalRevenue)}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Doanh thu chờ xác nhận</h6>
                                <h3 className="text-dark">{formatCurrency(dashboard?.revenueStats.revenueWaiting)}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-body text-center">
                                <h6 className="card-title text-success">Doanh thu đã xác nhận</h6>
                                <h3 className="text-dark">{formatCurrency(dashboard?.revenueStats.revenueSucceeded)}</h3>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Bảng Đơn hàng */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm" style={{ backgroundColor: "#e8f5e8" }}>
                            <div className="card-header bg-light" style={{ backgroundColor: "#f1f8e9" }}>
                                <h6 className="mb-0 text-success">Top món ăn bán chạy</h6>
                            </div>
                            <div className="card-body p-0">
                                {dashboard?.foodStats.totalFoodsSold === 0 ? (
                                    // Trường hợp mảng rỗng: Hiển thị message span toàn bộ cột
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-muted">
                                            Không có đơn hàng
                                        </td>
                                    </tr>
                                ) : (
                                    <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Mã Món Ăn</th>
                                                    <th>Tên món ăn</th>
                                                    <th>Danh mục</th>
                                                    <th>Số lượng đã bán</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboard?.foodStats.topFoods.map((item, index) => (
                                                    <tr key={item.foodId}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.foodName}</td>
                                                        <td><span className="badge bg-success">{item.categoryName}</span></td>
                                                        <td>{item.quantitySold}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </main>
    );
}
