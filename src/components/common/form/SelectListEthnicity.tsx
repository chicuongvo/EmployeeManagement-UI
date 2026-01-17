import { Select, type SelectProps } from "antd";
import { ETHNICITY_OPTIONS } from "@/constant/ethnicity";

interface SelectListEthnicityProps extends Omit<SelectProps, "options"> {
  value?: string;
  onChange?: (value: string) => void;
}

const SelectListEthnicity = ({
  value,
  onChange,
  ...props
}: SelectListEthnicityProps) => {
  return (
    <Select
      {...props}
      value={value}
      onChange={onChange}
      options={ETHNICITY_OPTIONS}
      placeholder={props.placeholder || "Chọn dân tộc"}
      showSearch
      optionFilterProp="label"
      allowClear
    />
  );
};

export default SelectListEthnicity;

