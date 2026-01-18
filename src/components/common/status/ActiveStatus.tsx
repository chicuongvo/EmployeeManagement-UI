/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tag } from "antd";

interface ActiveStatusProps {
  status: "ACTIVE" | "IN_ACTIVE";
  size?: "small" | "default" | "large";
}

const ACTIVE_STATUS_CONFIG: Record<
  "ACTIVE" | "IN_ACTIVE",
  {
    label: string;
    color: string;
  }
> = {
  IN_ACTIVE: {
    label: "Ngừng hoạt động",
    color: "red",
  },

  ACTIVE: {
    label: "Đang hoạt động",
    color: "green",
  },
};

const ActiveStatus = ({ status }: ActiveStatusProps) => {
  const config = ACTIVE_STATUS_CONFIG[status];

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

export default ActiveStatus;
