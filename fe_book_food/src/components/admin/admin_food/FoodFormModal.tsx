// src/components/food/FoodFormModal.tsx
import React, { useEffect, useState } from "react";
import { CategoryResponse } from "../../../types/category";
import { CreateFoodRequest, UpdateFoodRequest } from "../../../types/food";
import { toast } from "react-toastify";
import { useCategory } from "../../../hooks/useCategory";

type SubmitCtx = { mode: "create" | "edit"; id?: number | string };
type OnSubmit = (dto: CreateFoodRequest | UpdateFoodRequest, ctx: SubmitCtx) => Promise<void>;

interface Props {
    mode: "create" | "edit";
    initial?: {
        id?: number;
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        category: CategoryResponse;
        preparationTime: number;
        isAvailable?: boolean;
    };
    onClose: () => void;
    onSubmit: OnSubmit;
}

const FoodFormModal: React.FC<Props> = ({ mode, initial, onClose, onSubmit }) => {
    const { categories, getAllCategories } = useCategory();
    useEffect(() => { getAllCategories(); }, [getAllCategories]);

    // --- STATE ---
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [price, setPrice] = useState<string>(initial ? String(initial.price) : "");
    const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
    const [categoryId, setCategoryId] = useState<string>(
        initial?.category?.id ? String(initial.category.id) : ""
    );
    const [preparationTime, setPreparationTime] = useState<string>(
        initial ? String(initial.preparationTime) : ""
    );
    const [isAvailable, setIsAvailable] = useState<string>(
        initial?.isAvailable === true ? "1" : initial?.isAvailable === false ? "0" : ""
    );

    const [submitting, setSubmitting] = useState(false);
    const disabled = submitting || !name.trim();

    // --- HANDLE SUBMIT ---
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return;
        setSubmitting(true);

        const priceNum = price === "" ? NaN : Number(price);
        const prepNum = preparationTime === "" ? NaN : Number(preparationTime);
        const catIdNum = categoryId === "" ? NaN : Number(categoryId);
        const availBool = isAvailable === "1";

        try {
            if (mode === "create") {
                const payload: CreateFoodRequest = {
                    name,
                    description,
                    price: priceNum,
                    imageUrl,
                    categoryId: catIdNum,
                    preparationTime: prepNum,
                };
                await onSubmit(payload, { mode: "create" });
                toast.success("Đã tạo mới món ăn thành công!");
            } else {
                const payload: UpdateFoodRequest = {
                    name,
                    description,
                    price: priceNum,
                    imageUrl,
                    categoryId: catIdNum,
                    preparationTime: prepNum,
                    isAvailable: availBool,
                };
                await onSubmit(payload, { mode: "edit", id: initial?.id });
                toast.success("Đã cập nhật món ăn thành công!");
            }
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "#00000055" }}>
            {/* 🔸 tăng độ rộng modal */}
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{mode === "create" ? "Thêm món ăn" : "Sửa món ăn"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={submit}>
                        <div className="modal-body">
                            {/* Tên món */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Tên món <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="off"
                                    placeholder="Nhập tên món ăn"
                                />
                            </div>

                            {/* Mô tả */}
                            <div className="mb-3">
                                <label className="form-label">Mô tả</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    style={{ resize: "vertical" }}
                                />
                            </div>

                            {/* Giá bán */}
                            <div className="mb-3">
                                <label className="form-label">Giá bán (VNĐ)</label>
                                <input
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="VD: 45000"
                                />
                            </div>

                            {/* Link ảnh */}
                            <div className="mb-3">
                                <label className="form-label">Link ảnh</label>
                                <input
                                    className="form-control"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Danh mục */}
                            <div className="mb-3">
                                <label className="form-label">Danh mục</label>
                                <select
                                    className="form-select"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Thời gian chuẩn bị */}
                            <div className="mb-3">
                                <label className="form-label">Thời gian chuẩn bị (phút)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={preparationTime}
                                    onChange={(e) => setPreparationTime(e.target.value)}
                                    placeholder="VD: 15"
                                />
                            </div>

                            {/* Tình trạng */}
                            {mode === "edit" && (
                                <div className="mb-3">
                                    <label className="form-label">Tình trạng</label>
                                    <select
                                        className="form-select"
                                        value={isAvailable}
                                        onChange={(e) => setIsAvailable(e.target.value)}
                                    >
                                        <option value="">-- Chọn tình trạng --</option>
                                        <option value="1">Còn hàng</option>
                                        <option value="0">Hết hàng</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Hủy
                            </button>
                            <button type="submit" className="btn btn-success" disabled={disabled}>
                                {submitting ? "Đang lưu…" : mode === "create" ? "Thêm" : "Lưu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FoodFormModal;
