import type { SelectProps } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import { getDepartment, getListDepartment } from "@/apis/department";
import type { GetListDepartmentResponse } from "@/apis/department/model/Department";
import { useState, useCallback } from "react";

interface SelectListDepartmentProps extends SelectProps {
  defaultValue?: { id: number; name: string }[];
}

const SelectListDepartment = ({
  defaultValue = [],
  ...props
}: SelectListDepartmentProps) => {
  const [extraOptions, setExtraOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const fetchMissingOptions = useCallback(async (ids: number[]) => {
    for (const id of ids) {
      try {
        const department = await getDepartment(id);

        if (department) {
          setExtraOptions((prev) => {
            // Check if already exists
            if (prev.some((p) => p.value === department.id)) return prev;

            return [
              ...prev,
              {
                value: department.id,
                label: `${department.name} (${department.departmentCode})`,
              },
            ];
          });
        }
      } catch (e) {
        console.error("Failed to fetch department", id, e);
      }
    }
  }, []);

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
          q: search,
        })
      }
      mapOptions={(data: GetListDepartmentResponse) => {
        const currentValue = props.value ?? defaultValue.map((d) => d.id);

        const currentValueArray = Array.isArray(currentValue)
          ? currentValue
          : currentValue !== undefined
          ? [currentValue]
          : [];

        // Options from search results
        const options =
          data?.data.data?.map((d) => ({
            value: d.id,
            label: `${d.name} (${d.departmentCode})`,
          })) || [];

        // Default options
        const defaultOptions = defaultValue.map((item) => ({
          value: item.id,
          label: item.name,
        }));

        // Merge all options
        const mergedOptions = [
          ...defaultOptions,
          ...extraOptions,
          ...options.filter(
            (option) =>
              !defaultOptions.some((item) => item.value === option.value) &&
              !extraOptions.some((item) => item.value === option.value)
          ),
        ];

        // Check for missing values and fetch them
        const missingValues = currentValueArray.filter(
          (v) => !mergedOptions.some((opt) => opt.value === v)
        );

        if (missingValues.length > 0) {
          fetchMissingOptions(missingValues);
        }

        return mergedOptions;
      }}
      queryKey={[`select-list-departments`]}
      allowClear={props.allowClear}
    />
  );
};

export default SelectListDepartment;
