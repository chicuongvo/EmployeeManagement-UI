import { Tag } from "antd";
import type { WorkStatus as WorkStatusType } from "@/apis/employee/model/Employee";

interface WorkStatusProps {
  status: WorkStatusType;
  size?: "small" | "default" | "large";
}

const WORK_STATUS_CONFIG: Record<
  WorkStatusType,
  {
    label: string;
    color: string;
  }
> = {
  WORKING_ONSITE: {
    label: "Đang làm việc",
    color: "green",
  },
  WORK_FROM_HOME: {
    label: "Làm từ xa",
    color: "blue",
  },
  BUSINESS_TRIP: {
    label: "Công tác",
    color: "cyan",
  },
  TRAINING: {
    label: "Đào tạo",
    color: "purple",
  },
  ON_LEAVE_PERSONAL: {
    label: "Nghỉ phép",
    color: "orange",
  },
  ON_LEAVE_SICK: {
    label: "Nghỉ ốm",
    color: "red",
  },
  ON_LEAVE_MATERNITY: {
    label: "Nghỉ thai sản",
    color: "pink",
  },
  ON_LEAVE_VACATION: {
    label: "Nghỉ phép năm",
    color: "lime",
  },
  OFF_DUTY: {
    label: "Nghỉ không lương",
    color: "default",
  },
  ABSENT: {
    label: "Vắng mặt",
    color: "volcano",
  },
  RESIGNED: {
    label: "Đã nghỉ việc",
    color: "default",
  },
  TERMINATED: {
    label: "Bị sa thải",
    color: "error",
  },
  RETIRED: {
    label: "Nghỉ hưu",
    color: "gold",
  },
  // Legacy statuses (for backward compatibility)
  ACTIVE: {
    label: "Đang làm việc",
    color: "green",
  },
};

const WorkStatus = ({ status, size = "default" }: WorkStatusProps) => {
  const config = WORK_STATUS_CONFIG[status];

  if (!config) {
    return (
      <Tag color="default" className="m-0">
        {status}
      </Tag>
    );
  }

  return (
    <Tag color={config.color} className="m-0">
      {config.label}
    </Tag>
  );
};

export default WorkStatus;

