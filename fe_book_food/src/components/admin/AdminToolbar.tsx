//render 3 nút thêm sửa xóa

import React from "react";

interface Props{
    canEdit: boolean;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const AdminToolbar: React.FC<Props> = ({canEdit, onAdd, onEdit, onDelete}) =>{
    return (
    <div className="d-flex justify-content-end gap-2">
      <button className="btn btn-primary" onClick={onAdd}>Thêm mới</button>
      <button className="btn btn-success" onClick={onEdit} disabled={!canEdit}>Chỉnh sửa</button>
      <button className="btn btn-danger" onClick={onDelete} disabled={!canEdit}>Xóa</button>
    </div>
  );
}

export default React.memo(AdminToolbar);