import { Card, Avatar, Badge, Divider, Tag } from "antd";
import { CalendarOutlined, UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { useDepartmentDetailContext } from "../DepartmentDetailContext";
import dayjs from "dayjs";

const DepartmentInfoCard = () => {
    const { department } = useDepartmentDetailContext();

    if (!department) return null;

    return (
        <Card
            className="rounded-xl shadow-md"
            style={{ padding: "10px 20px" }}
        >
            {/* Department Name with Badge */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{department.name}</h2>
                <Tag
                    color="green"
                    style={{
                        fontSize: "12px",
                        fontWeight: 500,
                    }}
                >
                    {department.departmentCode}
                </Tag>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {department.description || "Không có mô tả"}
            </p>

            <Divider />
            {/* Info Items - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
                {/* Founded Date */}
                <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-blue-500 text-lg mt-1" />
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 mb-1">Ngày thành lập</p>
                        <p className="text-sm font-medium text-gray-800">
                            {dayjs(department.foundedAt).format("DD/MM/YYYY")}
                        </p>
                    </div>
                </div>

                {/* Employee Count */}
                <div className="flex items-start gap-3">
                    <UserOutlined className="text-green-500 text-lg mt-1" />
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-500 mb-1">Số lượng nhân viên</p>
                        <p className="text-sm font-medium text-gray-800">
                            {department.employees?.length || 0}
                        </p>
                    </div>
                </div>

                {/* Manager */}
                <div className="flex items-start gap-3 col-span-2">
                    <IdcardOutlined className="text-purple-500 text-lg mt-1" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-2">Trưởng phòng</p>
                        {department.manager ? (
                            <div className="flex items-center gap-2">
                                <Avatar
                                    src={department.manager.avatar}
                                    size={36}
                                    className="flex-shrink-0"
                                >
                                    {department.manager.fullName.charAt(0)}
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {department.manager.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {department.manager.email}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Chưa có trưởng phòng</p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DepartmentInfoCard;
