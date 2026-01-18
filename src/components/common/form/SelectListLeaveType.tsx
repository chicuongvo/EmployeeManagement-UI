import { Select, type SelectProps } from "antd";

interface LeaveTypeOption {
  id: number;
  name: string;
  maxDays: number;
}

// TODO: Replace with API call when leave type API is available
const LEAVE_TYPES: LeaveTypeOption[] = [
  { id: 1, name: "Nghỉ phép năm", maxDays: 20 },
  { id: 2, name: "Nghỉ ốm", maxDays: 30 },
  { id: 3, name: "Nghỉ thai sản", maxDays: 180 },
  { id: 4, name: "Nghỉ phép cá nhân", maxDays: 5 },
  { id: 5, name: "Nghỉ không lương", maxDays: 0 },
];

interface SelectListLeaveTypeProps extends SelectProps {
  showMaxDays?: boolean;
}

const SelectListLeaveType = ({
  showMaxDays = false,
  ...props
}: SelectListLeaveTypeProps) => {
  const options = LEAVE_TYPES.map((type) => ({
    value: type.id,
    label: showMaxDays
      ? `${type.name} (Tối đa: ${type.maxDays} ngày)`
      : type.name,
    title: type.name,
  }));

  return (
    <Select
      {...props}
      showSearch
      options={options}
      filterOption={(input, option) =>
        (option?.title ?? "").toLowerCase().includes(input.toLowerCase())
      }
    />
  );
};

export default SelectListLeaveType;
