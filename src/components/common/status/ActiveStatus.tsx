/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dropdown, Tag, type MenuProps } from "antd";

export type StatusType = "ACTIVE" | "INACTIVE";

interface ActiveStatusProps {
  status: StatusType;
  size?: "small" | "default" | "large";
  editable?: boolean;
  onChangeStatus?: (status: StatusType) => void;
}

const ACTIVE_STATUS_CONFIG: Record<
  StatusType,
  {
    label: string;
    color: string;
  }
> = {
  INACTIVE: {
    label: "Ngừng hoạt động",
    color: "red",
  },
  ACTIVE: {
    label: "Đang hoạt động",
    color: "green",
  },
};

const ActiveStatus = ({
  status,
  editable = false,
  onChangeStatus,
}: ActiveStatusProps) => {
  const config = ACTIVE_STATUS_CONFIG[status];

  const items: MenuProps["items"] = [
    {
      key: "ACTIVE",
      label: "Đang hoạt động",
    },
    {
      key: "INACTIVE",
      label: "Ngừng hoạt động",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onChangeStatus?.(e.key as StatusType);
  };

  const tag = (
    <Tag
      color={config?.color ?? "default"}
      className={`m-0 ${editable && status === "ACTIVE" ? "cursor-pointer" : ""}`}
    >
      {config?.label ?? status}
    </Tag>
  );

  if (editable && status === "ACTIVE") {
    return (
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick,
          selectable: true,
          defaultSelectedKeys: [status],
        }}
        trigger={["click"]}
      >
        {tag}
      </Dropdown>
    );
  }

  return tag;
};

export default ActiveStatus;
