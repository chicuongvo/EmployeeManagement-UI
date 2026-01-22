import { Card, Descriptions, Tag, Avatar } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { ContractResponse } from "@/types/Contract";

interface EmployeeWithDetails {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
  employeeCode?: string;
}

interface ContractWithDetails extends ContractResponse {
  employee?: EmployeeWithDetails;
  signedBy?: EmployeeWithDetails;
  updatedAt?: string;
}

interface BasicInformationProps {
  contract?: ContractWithDetails | null;
}

const BasicInformation = ({ contract }: BasicInformationProps) => {
  if (!contract) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "EXPIRED":
        return "red";
      case "DRAFT":
        return "orange";
      case "TERMINATED":
        return "volcano";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hiệu lực";
      case "EXPIRED":
        return "Hết hạn";
      case "DRAFT":
        return "Bản nháp";
      case "TERMINATED":
        return "Đã chấm dứt";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "Toàn thời gian";
      case "PART_TIME":
        return "Bán thời gian";
      case "INTERNSHIP":
        return "Thực tập";
      case "PROBATION":
        return "Thử việc";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Overview Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-600" />
            <span>Thông tin hợp đồng</span>
          </div>
        }
        size="small"
        className="shadow-sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">
              {contract.contractCode || "Chưa có mã"}
            </div>
            <Tag color={getStatusColor(contract.status)} className="mt-2">
              {getStatusText(contract.status)}
            </Tag>
          </div>

          <Descriptions
            column={1}
            size="small"
            colon={false}
            className="[&_.ant-descriptions-item]:mb-3 gap-2"
          >
            <Descriptions.Item label="Loại hợp đồng">
              <Tag color="blue">{getTypeText(contract.type)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày ký">
              {contract.signedDate
                ? dayjs(contract.signedDate).format("DD/MM/YYYY")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {contract.startDate
                ? dayjs(contract.startDate).format("DD/MM/YYYY")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {contract.endDate
                ? dayjs(contract.endDate).format("DD/MM/YYYY")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>

      {/* Employee Info Card */}
      {contract.employee && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-green-600" />
              <span>Nhân viên</span>
            </div>
          }
          size="small"
          className="shadow-sm"
        >
          <div className="flex items-center gap-4 p-2">
            <Avatar
              src={contract.employee?.avatar}
              size={56}
              icon={<UserOutlined />}
            />
            <div className="space-y-1">
              <div className="font-medium text-base">
                {contract.employee.fullName}
              </div>
              <div className="text-sm text-gray-500">
                {contract.employee.email}
              </div>
              {contract.employee?.employeeCode && (
                <div className="text-xs text-gray-400">
                  {contract.employee.employeeCode}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Signed By Info Card */}
      {contract.signedBy && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-purple-600" />
              <span>Người ký</span>
            </div>
          }
          size="small"
          className="shadow-sm"
        >
          <div className="flex items-center gap-4 p-2">
            <Avatar
              src={contract.signedBy?.avatar}
              size={56}
              icon={<UserOutlined />}
            />
            <div className="space-y-1">
              <div className="font-medium text-base">
                {contract.signedBy.fullName}
              </div>
              <div className="text-sm text-gray-500">
                {contract.signedBy.email}
              </div>
              {contract.signedBy?.employeeCode && (
                <div className="text-xs text-gray-400">
                  {contract.signedBy.employeeCode}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Timeline Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-orange-600" />
            <span>Thời gian</span>
          </div>
        }
        size="small"
        className="shadow-sm"
      >
        <Descriptions
          column={1}
          size="small"
          colon={false}
          className="[&_.ant-descriptions-item]:mb-3"
        >
          <Descriptions.Item label="Ngày tạo">
            {contract.createdAt
              ? dayjs(contract.createdAt).format("DD/MM/YYYY HH:mm")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {contract.updatedAt
              ? dayjs(contract.updatedAt).format("DD/MM/YYYY HH:mm")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default BasicInformation;
