import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useEmployeeDetailContext } from "../EmployeeDetailContex";
import { getAllContracts } from "@/api/contract.api";
import { useQuery } from "@tanstack/react-query";
import type { ContractResponse, ContractStatus, ContractType } from "@/types/Contract";
import CopyTextPopover from "@/components/common/shared/CopyTextPopover";
import { Button, Tooltip } from "antd";
import { EyeOutlined, FileTextOutlined, DownloadOutlined } from "@ant-design/icons";

const ContractTable = () => {
    const { employee } = useEmployeeDetailContext();

    const { data: contractData, isLoading } = useQuery({
        queryKey: ["contracts", "employee", employee?.id],
        queryFn: async () => {
            const response = await getAllContracts({
                employeeId: employee?.id,
                page: 1,
                limit: 100,
            });
            return response;
        },
        enabled: !!employee?.id,
    });

    const getStatusTag = (status: ContractStatus) => {
        const statusConfig: Record<
            ContractStatus,
            { color: string; text: string }
        > = {
            DRAFT: { color: "default", text: "Nháp" },
            ACTIVE: { color: "success", text: "Đang hoạt động" },
            EXPIRED: { color: "error", text: "Hết hạn" },
            TERMINATED: { color: "error", text: "Đã chấm dứt" },
            PENDING: { color: "warning", text: "Chờ duyệt" },
            RENEWED: { color: "processing", text: "Đã gia hạn" },
        };
        const config = statusConfig[status] || statusConfig.DRAFT;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const getTypeTag = (type: ContractType) => {
        const typeConfig: Record<ContractType, { color: string; text: string }> = {
            FULL_TIME: { color: "blue", text: "Toàn thời gian" },
            PART_TIME: { color: "cyan", text: "Bán thời gian" },
            INTERNSHIP: { color: "purple", text: "Thực tập" },
            PROBATION: { color: "orange", text: "Thử việc" },
            TEMPORARY: { color: "geekblue", text: "Tạm thời" },
            FREELANCE: { color: "green", text: "Freelance" },
            OUTSOURCE: { color: "lime", text: "Outsource" },
        };
        const config = typeConfig[type] || typeConfig.FULL_TIME;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns: ColumnsType<ContractResponse> = useMemo(
        () => [
            {
                title: "STT",
                key: "no",
                render: (_, __, index: number) => index + 1,
                width: 60,
                align: "center",
            },
            {
                title: "Mã hợp đồng",
                dataIndex: "contractCode",
                key: "contractCode",
                width: 150,
                align: "center",
                render: (value) => (
                    <CopyTextPopover text={value} />
                ),
            },
            {
                title: "Loại",
                dataIndex: "type",
                key: "type",
                width: 120,
                align: "center",
                render: (type: ContractType) => getTypeTag(type),
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 130,
                align: "center",
                render: (status: ContractStatus) => getStatusTag(status),
            },
            {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                key: "startDate",
                width: 120,
                align: "center",
                render: (value) => dayjs(value).format("DD/MM/YYYY"),
            },
            {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                key: "endDate",
                width: 120,
                align: "center",
                render: (value) => dayjs(value).format("DD/MM/YYYY"),
            },
            {
                title: "Ngày ký",
                dataIndex: "signedDate",
                key: "signedDate",
                width: 120,
                align: "center",
                render: (value) => dayjs(value).format("DD/MM/YYYY"),
            },
            {
                title: "File đính kèm",
                dataIndex: "attachment",
                key: "attachment",
                align: "center",
                width: 120,
                render: (attachment: string | null, record) => {
                    if (!attachment) {
                        return <span className="text-gray-400">-</span>;
                    }

                    const isPDF = attachment.match(/\.pdf$/i);
                    const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                    return (
                        <div className="flex items-center justify-center gap-2">
                            {isPDF ? (
                                <Tooltip title="Xem PDF">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<FileTextOutlined className="text-red-600 text-lg" />}
                                        onClick={() => {
                                            window.open(attachment, "_blank");
                                        }}
                                    />
                                </Tooltip>
                            ) : isImage ? (
                                <div className="w-8 h-8 rounded overflow-hidden border">
                                    <img
                                        src={attachment}
                                        alt="Contract file"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <FileTextOutlined className="text-gray-600 text-lg" />
                            )}
                            {/* <Tooltip title="Tải xuống">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    onClick={() => {
                                        const link = document.createElement("a");
                                        link.href = attachment;
                                        link.download = `${record.contractCode}${isPDF ? ".pdf" : isImage ? ".jpg" : ""}`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                />
                            </Tooltip> */}
                        </div>
                    );
                },
            },
            {
                title: "Thao tác",
                key: "action",
                width: 100,
                fixed: "right",
                align: "center",
                render: (_, record) => (
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                window.location.href = `/employee/contracts/${record.id}`;
                            }}
                        />
                    </Tooltip>
                ),
            },
        ],
        []
    );

    const dataSource = useMemo(() => {
        return contractData?.data || [];
    }, [contractData]);

    return (
        <div className="px-6 py-4">
            <Table
                loading={isLoading}
                rowKey={(record) => record.id}
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: true }}
                pagination={false}
                bordered
                size="middle"
            />
        </div>
    );
};

export default ContractTable;

