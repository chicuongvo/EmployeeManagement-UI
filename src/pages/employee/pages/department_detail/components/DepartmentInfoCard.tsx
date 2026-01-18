import { useState } from "react";
import { Card, Avatar, Divider, Tag, Form, Input, DatePicker } from "antd";
import { CalendarOutlined, UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { useDepartmentDetailContext } from "../DepartmentDetailContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";

const { TextArea } = Input;
const DEFAULT_AVATAR = "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg";

const DepartmentInfoCard = () => {
    const { department, isEditable } = useDepartmentDetailContext();
    const [expanded, setExpanded] = useState(false);

    if (!department) return null;

    return (
        <Card
            className={`rounded-xl h-[400px] transition-all duration-300 ${expanded ? "!h-fit" : ""}`}
        >
            {/* Department Name with Badge */}
            <div className="flex items-center gap-4 mb-4">
                {!isEditable ? (
                    <span className="text-[28px] font-bold text-zinc-800">{department.name}</span>
                ) : (
                    <Form.Item name="name" className="mb-0" style={{ flex: 1 }}>
                        <Input placeholder="Tên phòng ban" className="text-[24px] font-bold h-10" />
                    </Form.Item>
                )}
                {!isEditable ? (
                    <Tag
                        color="green"
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                        }}
                    >
                        {department.departmentCode}
                    </Tag>
                ) : (
                    <Form.Item name="departmentCode" className="mb-0" style={{ width: 120 }}>
                        <Input placeholder="Mã phòng ban" size="small" />
                    </Form.Item>
                )}
            </div>

            {/* Description */}
            {!isEditable ? (
                <div className="mb-6 pr-2">
                    <p className={`text-sm text-zinc-600 leading-relaxed text-justify ${!expanded ? "line-clamp-4" : ""}`}>
                        {department.description || "Không có mô tả"}
                    </p>
                    {department.description && department.description.length > 150 && (
                        <div
                            onClick={() => setExpanded(!expanded)}
                            className="text-green w-full text-[13px] font-medium cursor-pointer mt-2 transition-all flex justify-end"
                        >
                            <span className="text-righ text-xs">{expanded ? "Thu gọn" : "Xem thêm"}</span>
                        </div>
                    )}
                </div>
            ) : (
                <Form.Item name="description" className="mb-6">
                    <TextArea
                        placeholder="Nhập mô tả phòng ban"
                        rows={4}
                        className="text-sm"
                    />
                </Form.Item>
            )}

            <Divider />
            {/* Info Items - 2 columns */}
            <div className="grid grid-cols-2 gap-7">
                {/* Founded Date */}
                <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-zinc-500 text-lg mt-1" />
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-zinc-500 mb-1">Ngày thành lập</p>
                        {!isEditable ? (
                            <p className="text-sm font-medium text-zinc-800">
                                {dayjs(department.foundedAt).format("DD/MM/YYYY")}
                            </p>
                        ) : (
                            <Form.Item name="foundedAt" className="mb-0">
                                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" className="w-full" />
                            </Form.Item>
                        )}
                    </div>
                </div>

                {/* Employee Count - Read only */}
                <div className="flex items-start gap-3">
                    <UserOutlined className="text-zinc-500 text-lg mt-1" />
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-zinc-500 mb-1">Số lượng nhân viên</p>
                        <p className="text-sm font-medium text-zinc-800">
                            {department.employees?.length || 0}
                        </p>
                    </div>
                </div>

                {/* Manager - Editable */}
                <div className="flex items-start gap-3 col-span-2">
                    <IdcardOutlined className="text-zinc-500 text-lg mt-1" />
                    <div className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-zinc-500 mb-1">Quản lý</span>
                        {!isEditable ? (
                            department.manager ? (
                                <Link
                                    to={`/employee/employees/${department.manager.id}`}
                                    className="flex items-center gap-2"
                                >
                                    <Avatar
                                        src={department.manager.avatar || DEFAULT_AVATAR}
                                        size={24}
                                    />
                                    <span className="text-sm font-medium text-zinc-800">
                                        {department.manager.fullName}
                                    </span>
                                </Link>
                            ) : (
                                <span className="text-sm text-zinc-500">Chưa có quản lý</span>
                            )
                        ) : (
                            <Form.Item name="managerId" className="mb-0">
                                <SelectListEmployee
                                    placeholder="Chọn người quản lý"
                                    allowClear
                                />
                            </Form.Item>
                        )}
                    </div>
                </div>
            </div >
        </Card >
    );
};

export default DepartmentInfoCard;
