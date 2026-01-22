import { Select, type SelectProps } from "antd";

export type LeaveOption = "FULL_DAY" | "MORNING" | "AFTERNOON";

interface SelectListLeaveOptionProps extends Omit<SelectProps, "options"> {
  value?: LeaveOption;
  onChange?: (value: LeaveOption) => void;
}

const LEAVE_OPTION_MAP: Record<LeaveOption, string> = {
  FULL_DAY: "Cả ngày",
  MORNING: "Sáng",
  AFTERNOON: "Chiều",
};

const leaveOptionOptions = [
  { value: "FULL_DAY" as const, label: "Cả ngày" },
  { value: "MORNING" as const, label: "Sáng" },
  { value: "AFTERNOON" as const, label: "Chiều" },
];

const SelectListLeaveOption = (props: SelectListLeaveOptionProps) => {
  return (
    <Select
      {...props}
      options={leaveOptionOptions}
      placeholder={props.placeholder || "Chọn buổi nghỉ phép"}
    />
  );
};

export default SelectListLeaveOption;
export { LEAVE_OPTION_MAP };
