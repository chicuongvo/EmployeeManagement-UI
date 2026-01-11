import { Select, type SelectProps } from "antd";
import type { WorkStatus as WorkStatusType } from "@/apis/employee/model/Employee";
import { WORK_STATUS_OPTIONS } from "@/constant/workStatus";

interface SelectWorkStatusProps extends Omit<SelectProps, "options"> {
  value?: WorkStatusType;
  onChange?: (value: WorkStatusType) => void;
}

const SelectWorkStatus = ({
  value,
  onChange,
  ...props
}: SelectWorkStatusProps) => {
  // Group options by category
  const groupedOptions = WORK_STATUS_OPTIONS.reduce((acc, option) => {
    const group = option.group || "Khác";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({
      value: option.value,
      label: option.label,
    });
    return acc;
  }, {} as Record<string, { value: WorkStatusType; label: string }[]>);

  const selectOptions = Object.entries(groupedOptions).map(
    ([group, options]) => ({
      label: group,
      options: options,
    })
  );

  return (
    <Select
      {...props}
      value={value}
      onChange={onChange}
      options={selectOptions}
      placeholder="Chọn trạng thái làm việc"
      showSearch
      optionFilterProp="label"
    />
  );
};

export default SelectWorkStatus;
