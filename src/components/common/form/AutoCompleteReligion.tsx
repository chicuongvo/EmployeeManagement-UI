import { AutoComplete, type AutoCompleteProps } from "antd";
import { useCallback } from "react";
import { RELIGION_OPTIONS } from "@/constant/religion";

interface AutoCompleteReligionProps
  extends Omit<AutoCompleteProps, "options"> {
  value?: string;
  onChange?: (value: string) => void;
}

const AutoCompleteReligion = ({
  value,
  onChange,
  ...props
}: AutoCompleteReligionProps) => {
  const handleChange = useCallback(
    (selectedValue: string) => {
      onChange?.(selectedValue);
    },
    [onChange]
  );

  return (
    <AutoComplete
      {...props}
      value={value}
      options={RELIGION_OPTIONS}
      onChange={handleChange}
      placeholder={props.placeholder || "Chọn tôn giáo"}
      filterOption={(inputValue, option) => {
        if (!option) return false;
        const label =
          typeof option.label === "string"
            ? option.label
            : String(option.value);
        return label.toLowerCase().includes(inputValue.toLowerCase());
      }}
      allowClear
    />
  );
};

export default AutoCompleteReligion;

