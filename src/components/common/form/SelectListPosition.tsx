import type { SelectProps } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import { getPosition, getListPosition } from "@/apis/position";
import type { GetListPositionResponse } from "@/apis/position/model/Position";
import { useState, useCallback } from "react";

interface SelectListPositionProps extends SelectProps {
  defaultValue?: { id: number; name: string }[];
}

const SelectListPosition = ({
  defaultValue = [],
  ...props
}: SelectListPositionProps) => {
  const [extraOptions, setExtraOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const fetchMissingOptions = useCallback(async (ids: number[]) => {
    for (const id of ids) {
      try {
        const position = await getPosition(id);

        if (position) {
          setExtraOptions((prev) => {
            // Check if already exists
            if (prev.some((p) => p.value === position.id)) return prev;

            return [
              ...prev,
              {
                value: position.id,
                label: position.name,
              },
            ];
          });
        }
      } catch (e) {
        console.error("Failed to fetch position", id, e);
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
        getListPosition({
          name: search,
        })
      }
      mapOptions={(data: GetListPositionResponse) => {
        const currentValue = props.value ?? defaultValue.map((d) => d.id);

        const currentValueArray = Array.isArray(currentValue)
          ? currentValue
          : currentValue !== undefined
          ? [currentValue]
          : [];

        // Options from search results
        const options =
          data?.data?.map((d) => ({
            value: d.id,
            label: d.name,
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
      queryKey={[`select-list-positions`]}
      allowClear={props.allowClear}
    />
  );
};

export default SelectListPosition;
