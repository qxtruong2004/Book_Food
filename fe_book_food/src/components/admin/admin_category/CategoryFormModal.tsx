// src/components/category/CategoryFormModal.tsx
import React, { useState } from "react";
import { CategoryResponse, CreateCategoryRequest } from "../../../types/category";


interface Props {
  mode: "create" | "edit";
  initial?: Partial<CategoryResponse>;
  onClose: () => void;
  onSubmit: (dto: CreateCategoryRequest) => Promise<void>;
}

const CategoryFormModal: React.FC<Props> = ({ mode, initial, onClose, onSubmit }) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  const title = mode === "create" ? "Thêm danh mục" : "Sửa danh mục";
  const disabled = !name.trim() || submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description?.trim() || undefined });
      onClose();
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
              <div className="mb-3">
                <label className="form-label">Tên danh mục <span className="text-danger">*</span></label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="mb-0">
                <label className="form-label">Mô tả</label>
                <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
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

export default CategoryFormModal;
