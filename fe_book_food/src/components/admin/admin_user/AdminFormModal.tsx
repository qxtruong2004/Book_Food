import React, { useState } from "react";
import { UserRegisterRequest } from "../../../types/auth";
import { UpdateUserRequest, UserResponse } from "../../../types/user";
import { toast } from "react-toastify";

type SubmitCtx = { mode: "create" | "edit"; id?: number | string };
type OnSubmit = (dto: UserRegisterRequest | UpdateUserRequest, ctx: SubmitCtx) => Promise<void>;

interface Props {
  mode: "create" | "edit";
  initial?: { id?: number | string; username?: string; fullName?: string; phone?: string; email?: string; address?: string; password?: string };
  onClose: () => void;
  onSubmit: OnSubmit;
}

const AdminFormModal: React.FC<Props> = ({ mode, initial, onClose, onSubmit }) => {
  const [username, setUserName] = useState(initial?.username ?? "");
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState(initial?.password ?? "");
  // const [role, setRole] = useState(initial?.role ?? "");
  // const [status, setStatus] = useState(initial?.status ?? "");
  const [submitting, setSubmitting] = useState(false);

  const title = mode === "create" ? "Thêm người dùng" : "Sửa thông tin người dùng";
  const disabled = !username.trim() || submitting;


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return; // nếu disabled là false
    setSubmitting(true);
    
    try {
      if (mode === "create") {
        const payload: UserRegisterRequest = { fullName, username, email, password };
        await onSubmit(payload, { mode: "create" });
        onClose();
        toast.success("Đã tạo mới tài khoản thành công")
      }
      else {
        const payload: UpdateUserRequest = { name: fullName, phone, email, address, ...(password ? { password } : {}) };
        await onSubmit(payload, { mode: "edit", id: initial?.id });
        toast.success("Đã cập nhật tài khoản thành công")
        onClose();
      }

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: "#00000055" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={submit} autoComplete="off">
            <div className="modal-body">
              {/* CREATE MODE */}
              {mode === "create" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Username <span className="text-danger">*</span></label>
                    <input className="form-control" value={username} onChange={e => setUserName(e.target.value)} autoComplete="off" name="new-username" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">FullName <span className="text-danger">*</span></label>
                    <input className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email <span className="text-danger">*</span></label>
                    <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password <span className="text-danger">*</span></label>
                    <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="off" name="new-password" />
                  </div>
                </>
              )}

              {/* EDIT MODE */}
              {mode === "edit" && (
                <>
                  {/* Username hiển thị cho biết, không sửa */}
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input className="form-control" value={username} disabled readOnly />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">FullName <span className="text-danger">*</span></label>
                    <input className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone <span className="text-danger">*</span></label>
                    <input className="form-control" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email <span className="text-danger">*</span></label>
                    <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address <span className="text-danger">*</span></label>
                    <input className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password (để trống nếu không đổi)</label>
                    <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Để trống nếu không đổi" />
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
}
export default AdminFormModal;