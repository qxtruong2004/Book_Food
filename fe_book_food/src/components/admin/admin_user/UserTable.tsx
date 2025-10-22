import React from "react";
import { UserResponse } from "../../../types/user";

interface Props {
    data: UserResponse[];
    selectedId: number | null;
    onSelect: (id: number) => void;
}

const UserTable: React.FC<Props> = ({ data, selectedId, onSelect }) => {
    return (
        <div
            className="border rounded-3 bg-white shadow-sm"
            style={{ minHeight: 320, overflow: "hidden" }}
        >
            <div className="table-responsive" style={{ height: "100%" }}>
                <table
                    className="table table-sm mb-0 align-middle"
                    style={{ height: "100%" }}
                >
                    <thead
                        className="table-light"
                        style={{
                            background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)",
                            borderBottom: "2px solid #c8e6c9",
                        }}
                    >
                        <tr>
                            <th
                                style={{
                                    width: 70,
                                    color: "#2e7d32",
                                    fontWeight: "600",
                                    padding: "16px 12px",
                                }}
                            >
                                <i className="fas fa-hashtag me-1"></i> ID
                            </th>
                            <th
                                style={{
                                    width: 200,
                                    color: "#2e7d32",
                                    fontWeight: "600",
                                    padding: "16px 12px",
                                }}
                            >
                                <i className="fas fa-tag me-1"></i> Username
                            </th>
                            <th
                                style={{
                                    width: 260,
                                    color: "#2e7d32",
                                    fontWeight: "600",
                                    padding: "16px 12px",
                                }}
                            >
                                <i className="fas fa-tag me-1"></i> Fullname
                            </th>
                            <th
                                style={{
                                    width: 260,
                                    color: "#2e7d32",
                                    fontWeight: "600",
                                    padding: "16px 12px",
                                }}
                            >
                                <i className="fas fa-tag me-1"></i> Email
                            </th>
                            <th
                                style={{
                                    width: 140,
                                    color: "#2e7d32",
                                    fontWeight: "600",
                                    padding: "16px 12px",
                                }}
                            >
                                <i className="fas fa-hashtag me-1"></i> Role
                            </th>
                            <th
                                style={{
                                    color: "#2e7d32",
                                    fontWeight: "600",
                                    padding: "16px 12px",
                                }}
                            >
                                <i className="fas fa-align-left me-1"></i> Trạng thái tài khoản
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#fafafa" }}>
                        {!data.length ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center text-muted py-5"
                                    style={{
                                        color: "#9e9e9e",
                                        fontSize: "1.1rem",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <i
                                        className="fas fa-folder-open fa-2x mb-2 d-block"
                                        style={{ color: "#c8e6c9" }}
                                    ></i>
                                    Chưa có tài khoản nào
                                </td>
                            </tr>
                        ) : (
                            data.map((c) => (
                                <tr
                                    key={c.id}
                                    onClick={() => onSelect(c.id)}
                                    className={`align-middle ${selectedId === c.id ? "table-success" : ""
                                        }`}
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        borderBottom: "1px solid #f1f8e9",
                                    }}
                                >
                                    {/* TD 1: ID */}
                                    <td
                                        className="fw-semibold text-success"
                                        style={{ padding: "12px", color: "#4caf50" }}
                                    >
                                        {c.id}
                                    </td>

                                    {/* TD 2: Username */}
                                    <td style={{ padding: "12px" }}>
                                        <span className="fw-medium" style={{ color: "#2e7d32" }}>
                                            {c.username}
                                        </span>
                                    </td>

                                    {/* TD 3: Fullname - Thêm nội dung {c.fullName} */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            maxWidth: 260, // Giữ width phù hợp với th
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            color: "#616161",
                                        }}
                                        title={c.fullName} // Tooltip khi hover
                                    >
                                        {c.fullName || (
                                            <span className="text-muted">Không có tên</span>
                                        )}
                                    </td>

                                    {/* TD 4: Email - Tách riêng, thêm nội dung */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            maxWidth: 260,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            color: "#616161",
                                        }}
                                        title={c.email}
                                    >
                                        {c.email || (
                                            <span className="text-muted">Không có email</span>
                                        )}
                                    </td>

                                    {/* TD 5: Role - Tách riêng, thêm nội dung */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            color: "#2e7d32",
                                            fontWeight: "500",
                                        }}
                                    >
                                        <span className="badge bg-success-subtle text-success">
                                            {c.role || "User"}
                                        </span>
                                    </td>

                                    {/* TD 6: Status - Di chuyển đúng vị trí cuối */}
                                    <td style={{ padding: "12px", color: "#616161" }}>
                                        {c.status || (
                                            <span className="text-muted">Không có mô tả</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(UserTable);
