import { Tag } from "antd";
import type { LeaveApplicationStatus } from "@/apis/leave-application/model/LeaveApplication";

interface LeaveApplicationStatusProps {
  status: LeaveApplicationStatus;
}

const statusConfig: Record<
  LeaveApplicationStatus,
  { color: string; label: string }
> = {
  PENDING: {
    color: "orange",
    label: "Chờ duyệt",
  },
  APPROVED: {
    color: "green",
    label: "Đã duyệt",
  },
  REJECTED: {
    color: "red",
    label: "Từ chối",
  },
};

const LeaveApplicationStatusComponent = ({
  status,
}: LeaveApplicationStatusProps) => {
  const config = statusConfig[status] || {
    color: "default",
    label: status,
  };

  return (
    <Tag color={config.color} className="font-primary">
      {config.label}
    </Tag>
  );
};

export default LeaveApplicationStatusComponent;
