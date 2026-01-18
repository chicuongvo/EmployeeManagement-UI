import { Select, type SelectProps } from "antd";
import type { LeaveApplicationStatus } from "@/apis/leave-application/model/LeaveApplication";

interface SelectLeaveApplicationStatusProps
  extends Omit<SelectProps, "options"> {
  value?: LeaveApplicationStatus;
  onChange?: (value: LeaveApplicationStatus) => void;
}

const leaveApplicationStatusOptions = [
  { value: "PENDING" as const, label: "Chờ duyệt" },
  { value: "APPROVED" as const, label: "Đã duyệt" },
  { value: "REJECTED" as const, label: "Từ chối" },
];

const SelectLeaveApplicationStatus = (
  props: SelectLeaveApplicationStatusProps
) => {
  return (
    <Select
      {...props}
      options={leaveApplicationStatusOptions}
      placeholder={props.placeholder || "Chọn trạng thái"}
    />
  );
};

export default SelectLeaveApplicationStatus;
