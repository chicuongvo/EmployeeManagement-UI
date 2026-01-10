/* eslint-disable @typescript-eslint/no-explicit-any */
import { type QueryKey, useQuery } from "@tanstack/react-query";
import { Select, type SelectProps, Checkbox } from "antd";
import { useCallback, useState, useMemo, type ReactNode } from "react";

import { debounce } from "@/utils/debounce";

type SelectListGenericProps<T, R> = {
  fetcher: (search: string) => Promise<R>;
  mapOptions: (data: R) => {
    value: string | number;
    label: string | ReactNode;
    title?: string;
    [key: string]: any;
  }[];
  queryKey: string | QueryKey;
  queryEnabled?: boolean;
  showSelectAll?: boolean;
  customFilterOption?: (input: string, option?: any) => boolean;
} & SelectProps<T>;

function SelectListGeneric<T = any, R = any>({
  fetcher,
  mapOptions,
  queryKey,
  queryEnabled = true,
  value,
  showSelectAll = false,
  onChange,
  filterOption = false,
  customFilterOption,
  ...rest
}: SelectListGenericProps<T, R>) {
  const [search, setSearch] = useState<string>("");

  const { data } = useQuery({
    queryFn: () => fetcher(search),
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, search]
      : [queryKey, search],
    enabled: queryEnabled,
  });

  const handleSearch = useCallback(
    debounce((val: string) => setSearch(val), 500),
    []
  );

  const handleChange = useCallback(
    (val: any, option: any) => {
      if (!val || (Array.isArray(val) && val.length === 0)) {
        setSearch("");
      }
      onChange?.(val, option);
    },
    [onChange]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (showSelectAll && rest.mode === "multiple" && data) {
        const allOptions = mapOptions(data);
        if (checked) {
          // Select all options
          const allValues = allOptions.map((opt) => opt.value);
          onChange?.(allValues as T, allOptions);
        } else {
          // Deselect all options
          onChange?.([] as T, []);
        }
      }
    },
    [showSelectAll, rest.mode, data, mapOptions, onChange]
  );

  // Create options without "Select All" option
  const createOptions = useCallback(() => {
    return data ? mapOptions(data) : [];
  }, [data, mapOptions]);

  // Calculate checkbox state based on current selection
  const selectAllCheckboxState = useMemo(() => {
    if (!showSelectAll || rest.mode !== "multiple" || !data) {
      return { checked: false, indeterminate: false };
    }

    const allOptions = mapOptions(data);
    const allValues = allOptions.map((opt) => opt.value);
    const currentValues = Array.isArray(value) ? value : [];

    if (currentValues.length === 0) {
      return { checked: false, indeterminate: false };
    }

    if (
      currentValues.length === allValues.length &&
      allValues.every((val) =>
        (currentValues as (string | number)[]).includes(val)
      )
    ) {
      return { checked: true, indeterminate: false };
    }

    return { checked: false, indeterminate: true };
  }, [showSelectAll, rest.mode, data, mapOptions, value]);

  return (
    <Select
      {...rest}
      showSearch
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      options={createOptions()}
      popupRender={(menu) => (
        <div>
          {/* Select All Checkbox */}
          {showSelectAll &&
            rest.mode === "multiple" &&
            createOptions().length > 0 && (
              <div
                style={{
                  padding: "4px 12px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  checked={selectAllCheckboxState.checked}
                  indeterminate={selectAllCheckboxState.indeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  <span
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    Select All
                  </span>
                </Checkbox>
              </div>
            )}
          {/* Regular options menu */}
          {menu}
        </div>
      )}
      filterOption={customFilterOption || filterOption}
    />
  );
}

export default SelectListGeneric;
