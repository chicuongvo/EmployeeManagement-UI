import { Modal, Descriptions, Tag, Button, Space } from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useContractContext } from "../ContractContext";
import type { ContractStatus, ContractType } from "@/types/Contract";
import dayjs from "dayjs";

const ModalContract = () => {
  const {
    popupContract,
    setPopupContract,
    selectedContract,
    setSelectedContract,
  } = useContractContext();

  const handleCancel = () => {
    setPopupContract(false);
    setSelectedContract(null);
  };

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

  if (!selectedContract) return null;

  return (
    <Modal
      title="Chi tiết hợp đồng"
      open={popupContract}
      onCancel={handleCancel}
      width={700}
      footer={null}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{selectedContract.id}</Descriptions.Item>
        <Descriptions.Item label="Mã hợp đồng">
          {selectedContract.contractCode}
        </Descriptions.Item>
        <Descriptions.Item label="Loại hợp đồng">
          {getTypeTag(selectedContract.type)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {getStatusTag(selectedContract.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Nhân viên">
          <div>
            <div>{selectedContract.employee?.fullName || "-"}</div>
            {selectedContract.employee?.email && (
              <div className="text-sm text-gray-500">
                {selectedContract.employee.email}
              </div>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Người ký">
          <div>
            <div>{selectedContract.signedBy?.fullName || "-"}</div>
            {selectedContract.signedBy?.email && (
              <div className="text-sm text-gray-500">
                {selectedContract.signedBy.email}
              </div>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">
          {selectedContract.startDate
            ? dayjs(selectedContract.startDate).format("DD/MM/YYYY")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">
          {selectedContract.endDate
            ? dayjs(selectedContract.endDate).format("DD/MM/YYYY")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày ký">
          {selectedContract.signedDate
            ? dayjs(selectedContract.signedDate).format("DD/MM/YYYY")
            : "-"}
        </Descriptions.Item>
        {selectedContract.note && (
          <Descriptions.Item label="Ghi chú">
            <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
              {selectedContract.note}
            </div>
          </Descriptions.Item>
        )}
        {selectedContract.createdAt && (
          <Descriptions.Item label="Ngày tạo">
            {dayjs(selectedContract.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        )}
        {selectedContract.attachment && (
          <Descriptions.Item label="File hợp đồng đã upload">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
              <div className="flex-shrink-0">
                {selectedContract.attachment.match(
                  /\.(jpg|jpeg|png|gif|webp)$/i,
                ) ? (
                  <div className="w-16 h-16 rounded overflow-hidden border bg-white flex items-center justify-center">
                    <img
                      src={selectedContract.attachment}
                      alt="Contract preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : selectedContract.attachment.match(/\.pdf$/i) ? (
                  <div className="w-16 h-16 rounded border bg-red-50 flex items-center justify-center">
                    <FileTextOutlined className="text-2xl text-red-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded border bg-gray-100 flex items-center justify-center">
                    <FileOutlined className="text-2xl text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {selectedContract.attachment.match(
                    /\.(jpg|jpeg|png|gif|webp)$/i,
                  ) ? (
                    <FileImageOutlined className="text-blue-600" />
                  ) : selectedContract.attachment.match(/\.pdf$/i) ? (
                    <FileTextOutlined className="text-red-600" />
                  ) : (
                    <FileOutlined className="text-gray-600" />
                  )}
                  <span className="text-sm font-medium truncate">
                    {selectedContract.attachment.match(/\.pdf$/i)
                      ? "Hợp đồng.pdf"
                      : selectedContract.attachment.match(
                            /\.(jpg|jpeg|png|gif|webp)$/i,
                          )
                        ? "Hợp đồng.jpg"
                        : "File đính kèm"}
                  </span>
                </div>
                <Space>
                  <Button
                    type="default"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      window.open(selectedContract.attachment!, "_blank");
                    }}
                  >
                    Xem file
                  </Button>
                  <Button
                    type="default"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedContract.attachment!;
                      link.download =
                        selectedContract.contractCode +
                        (selectedContract.attachment!.match(/\.pdf$/i)
                          ? ".pdf"
                          : selectedContract.attachment!.match(
                                /\.(jpg|jpeg|png|gif|webp)$/i,
                              )
                            ? ".jpg"
                            : "");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Tải xuống
                  </Button>
                </Space>
              </div>
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default ModalContract;
