// src/components/category/CategoryFormModal.tsx
import React, { useEffect, useState } from "react";
import { CategoryResponse, CreateCategoryRequest } from "../../../types/category";
import { CreateFoodRequest, FoodResponse, UpdateFoodRequest } from "../../../types/food";
import { toast } from "react-toastify";
import { useCategory } from "../../../hooks/useCategory";

type SubmitCtx = { mode: "create" | "edit"; id?: number | string };
type OnSubmit = (dto: CreateFoodRequest | UpdateFoodRequest, ctx: SubmitCtx) => Promise<void>;

interface Props {
    mode: "create" | "edit";
    initial?: {
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        categoryId: number;
        preparationTime: number;
        isAvailable?: boolean;
    };
    onClose: () => void;
    onSubmit: OnSubmit;
}

const FoodFormModal: React.FC<Props> = ({ mode, initial, onClose, onSubmit }) => {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [price, setPrice] = useState(initial?.price ?? 0);
    const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
    const [categoryId, setCategoryId] = useState(initial?.categoryId ?? 1);
    const [preparationTime, setPreparationTime] = useState(initial?.preparationTime ?? 1);
    const [isAvailable, setIsAvailable] = useState(initial?.isAvailable ?? "");

    const [submitting, setSubmitting] = useState(false);

    const title = mode === "create" ? "Thêm món ăn" : "Sửa món ăn";
    const disabled = !name.trim() || submitting;

    
    const {categories, getAllCategories} = useCategory();
    useEffect(() => {
  getAllCategories();          // nạp dữ liệu
}, [getAllCategories]);
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return;
        setSubmitting(true);
        try {
            if (mode === "create") {
                const payload: CreateFoodRequest = { name, description, price, imageUrl, categoryId, preparationTime };
                await onSubmit(payload, { mode: "create" });
                onClose();
                toast.success("Đã tạo mới món ăn thành công")
            }
            // else {
            //     const payload: UpdateUserRequest = { name: fullName, phone, email, address, ...(password ? { password } : {}) };
            //     await onSubmit(payload, { mode: "edit", id: initial?.id });
            //     toast.success("Đã cập nhật tài khoản thành công")
            //     onClose();
            // }

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "#00000055" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={submit}>
                        <div className="modal-body">
                            {/* CREATE MODE */}
                            {mode === "create" && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Tên món <span className="text-danger">*</span></label>
                                        <input className="form-control" value={name} onChange={e => setName(e.target.value)} autoComplete="off" name="new-username" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mô tả <span className="text-danger">*</span></label>
                                        <input className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Giá bán <span className="text-danger">*</span></label>
                                        <input className="form-control"  value={price} onChange={e => setPrice(Number(e.target.value))} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Link ảnh <span className="text-danger">*</span></label>
                                        <input className="form-control"  value={imageUrl} onChange={e => setImageUrl(e.target.value)} autoComplete="off" name="new-password" />
                                    </div>

                                    {/* chọn danh mục cho món ăn */}
                                     <div className="mb-3">
                                        <label className="form-label">Thuộc danh mục <span className="text-danger">*</span></label>
                                        <select className="form-select"  value={categoryId} onChange={(e) => {const val = e.target.value; setCategoryId(Number(val));}} autoComplete="off" name="categoryId">
                                            <option value=""> --Chọn danh mục--</option>
                                                {categories.map((c) =>(
                                                    <option key={c.id} value={c.id}>{c.name} </option>
                                                ))}
                                        </select>
                                    </div>

                                     <div className="mb-3">
                                        <label className="form-label">Thời gian  chuẩn bị <span className="text-danger">*</span></label>
                                        <input className="form-control" value={preparationTime} onChange={e => setPreparationTime(Number(e.target.value))} autoComplete="off" name="new-password" />
                                    </div>
                                </>
                            )}

                            
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Hủy</button>
                            <button type="submit" className="btn btn-success" disabled={disabled}>
                                {submitting ? "Đang lưu…" : (mode === "create" ? "Thêm" : "Lưu")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FoodFormModal;
