import type { SelectProps } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import type { ContractStatus } from "@/types/Contract";

interface SelectListContractStatusProps extends SelectProps {
  defaultValue?: { value: string; label: string }[];
}

const CONTRACT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Nháp" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "EXPIRED", label: "Hết hạn" },
  { value: "TERMINATED", label: "Chấm dứt" },
  { value: "RENEWED", label: "Gia hạn" },
] as const;

const SelectListContractStatus = ({
  defaultValue = [],
  ...props
}: SelectListContractStatusProps) => {
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
      fetcher={async (search: string) => {
        // Return static data filtered by search
        const filtered = CONTRACT_STATUS_OPTIONS.filter((option) =>
          option.label.toLowerCase().includes(search.toLowerCase())
        );
        return { data: filtered };
      }}
      mapOptions={(data: { data: typeof CONTRACT_STATUS_OPTIONS }) => {
        // Options from search results
        const options =
          data?.data?.map((d) => ({
            value: d.value,
            label: d.label,
            title: d.label, // For search/filter
          })) || [];

        // Default options
        const defaultOptions = defaultValue.map((item) => ({
          value: item.value,
          label: item.label,
          title: item.label, // For search/filter
        }));

        // Merge all options
        const mergedOptions = [
          ...defaultOptions,
          ...options.filter(
            (option) =>
              !defaultOptions.some((item) => item.value === option.value)
          ),
        ];

        return mergedOptions;
      }}
      customFilterOption={(input, option) => {
        // Filter based on title (text) instead of label (ReactNode)
        const title = option?.title || "";
        return title.toLowerCase().includes(input.toLowerCase());
      }}
      queryKey={[`select-list-contract-statuses`]}
      allowClear={props.allowClear}
    />
  );
};

export default SelectListContractStatus;
