import { Table, Avatar, Button, Popconfirm, message, Tag } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { ProjectMember } from "@/apis/project";
import { removeProjectMember } from "@/apis/project";
import type { ColumnsType } from "antd/es/table";

interface MemberTableProps {
    members: ProjectMember[];
    projectId: number;
    isLoading: boolean;
    onMemberRemoved: () => void;
}

const MemberTable = ({ members, projectId, isLoading, onMemberRemoved }: MemberTableProps) => {
    const removeMutation = useMutation({
        mutationFn: (employeeId: number) => removeProjectMember(projectId, employeeId),
    });

    const handleRemoveMember = async (employeeId: number, memberName: string) => {
        try {
            await removeMutation.mutateAsync(employeeId);
            message.success(`Đã xóa ${memberName} khỏi dự án!`);
            onMemberRemoved();
        } catch (error) {
            console.error("Remove member failed:", error);
            message.error("Xóa thành viên thất bại!");
        }
    };

    const columns: ColumnsType<ProjectMember> = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Nhân viên",
            key: "employee",
            width: 300,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.employee.avatar}
                        icon={<UserOutlined />}
                        size={40}
                    />
                    <div className="flex flex-col">
                        <span className="font-medium">{record.employee.fullName}</span>
                        <span className="text-xs text-gray-500">{record.employee.email}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Mã nhân viên",
            dataIndex: ["employee", "employeeCode"],
            key: "employeeCode",
            width: 150,
            render: (code) => code || "-",
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            width: 150,
            render: (role) => role ? <Tag color="blue">{role}</Tag> : <span className="text-gray-400">Chưa có</span>,
        },
        {
            title: "Ngày tham gia",
            dataIndex: "joinedAt",
            key: "joinedAt",
            width: 150,
            align: "center",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Hành động",
            key: "action",
            width: 100,
            align: "center",
            fixed: "right",
            render: (_, record) => (
                <Popconfirm
                    title="Xóa thành viên"
                    description={`Bạn có chắc muốn xóa ${record.employee.fullName} khỏi dự án?`}
                    onConfirm={() => handleRemoveMember(record.employeeId, record.employee.fullName)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        loading={removeMutation.isPending}
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={members}
            rowKey="id"
            loading={isLoading}
            pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng số: ${total} thành viên`,
                showSizeChanger: true,
            }}
            scroll={{ x: 800 }}
        />
    );
};

export default MemberTable;
