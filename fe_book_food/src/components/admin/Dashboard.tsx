import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { getDateRange } from "../../utils/dateRange";
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
                    <div className="row">
                        <div className="row">
                            {/* 1. Số lượng đơn */}
                            <div className="col-md mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-primary bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-primary fw-semibold">Số lượng đơn</h6>
                                        <h3 className="text-dark fw-bold">{dashboard?.orderStats.totalOrders}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Số món đã bán */}
                            <div className="col-md mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-info bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-info fw-semibold">Số món đã bán</h6>
                                        <h3 className="text-dark fw-bold">{dashboard?.foodStats.totalFoodsSold}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Đơn hoàn thành công */}
                            <div className="col-md mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-success bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-success fw-semibold">Đơn hoàn thành</h6>
                                        <h3 className="text-success fw-bold">{dashboard?.orderStats.totalSucceededOrders}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Đơn chuẩn bị (đang chờ) */}
                            <div className="col-md mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-orange fw-semibold">Đơn chuẩn bị</h6>
                                        <h3 className="text-orange fw-bold">{dashboard?.orderStats.totalPending}</h3>
                                    </div>  
                                </div>
                            </div>

                            {/* 5. Đơn chờ giao */}
                            <div className="col-md mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-primary bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-primary fw-semibold">Đơn chờ giao</h6>
                                        <h3 className="text-primary fw-bold">{dashboard?.orderStats.totalPreparing}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* 6. Đơn bị hủy */}
                            <div className="col-md mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-danger bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-danger fw-semibold">Đơn bị hủy</h6>
                                        <h3 className="text-danger fw-bold">{dashboard?.orderStats.totalFailed}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thống kê Doanh thu */}
                        <div className="row mt-4">
                            {/* Tổng doanh thu */}
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-success bg-gradient text-white">
                                    <div className="card-body text-center">
                                        <h6 className="card-title fw-semibold">Tổng doanh thu</h6>
                                        <h3 className="fw-bold">{formatCurrency(dashboard?.revenueStats.totalRevenue)}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Doanh thu chờ xác nhận */}
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-orange fw-semibold">Doanh thu chờ xác nhận</h6>
                                        <h3 className="text-orange fw-bold">{formatCurrency(dashboard?.revenueStats.revenueWaiting)}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Doanh thu đã xác nhận */}
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100 bg-success bg-opacity-10">
                                    <div className="card-body text-center">
                                        <h6 className="card-title text-success fw-semibold">Doanh thu đã xác nhận</h6>
                                        <h3 className="text-success fw-bold">{formatCurrency(dashboard?.revenueStats.revenueSucceeded)}</h3>
                                    </div>
                                </div>
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
