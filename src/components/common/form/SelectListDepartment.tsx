import type { SelectProps } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import { getListDepartment } from "@/apis/department";
import type { GetListDepartmentResponse } from "@/apis/department/model/Department";

interface SelectListDepartmentProps extends SelectProps {
  defaultValue?: { id: number; name: string }[];
}

const SelectListDepartment = ({
  defaultValue = [],

  ...props
}: SelectListDepartmentProps) => {
  return (
    <SelectListGeneric
      {...props}
      styles={{
        popup: {
          root: {
            maxHeight: 270,
            overflowY: "auto",
          },
        },
      }}
      fetcher={(search) =>
        getListDepartment({
          name: search,
        })
      }
      mapOptions={(data: GetListDepartmentResponse) => {
        const currentValue = props.value ?? defaultValue.map((d) => d.id);

        const currentValueArray = Array.isArray(currentValue)
          ? currentValue
          : currentValue !== undefined
          ? [currentValue]
          : [];

        const options =
          data?.data?.map((d) => ({
            value: d.id,
            label: d.name,
          })) || [];

        const defaultOptions = defaultValue.map((item) => ({
          value: item.id,
          label: item.name,
        }));

        const mergedOptions = [
          ...defaultOptions,
          ...options.filter(
            (option) =>
              !defaultOptions.some((item) => item.value === option.value) &&
              !currentValueArray.some((item) => item === option.value)
          ),
        ];

        return mergedOptions;
      }}
      queryKey={[`select-list-departments`]}
      allowClear={props.allowClear}
    />
  );
};

export default SelectListDepartment;
