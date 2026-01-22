import type { SelectProps } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import type { ContractType } from "@/types/Contract";

interface SelectListContractTypeProps extends SelectProps {
  defaultValue?: { value: string; label: string }[];
}

const CONTRACT_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Toàn thời gian" },
  { value: "PART_TIME", label: "Bán thời gian" },
  { value: "INTERNSHIP", label: "Thực tập" },
  { value: "PROBATION", label: "Thử việc" },
  { value: "TEMPORARY", label: "Tạm thời" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "OUTSOURCE", label: "Outsource" },
] as const;

const SelectListContractType = ({
  defaultValue = [],
  ...props
}: SelectListContractTypeProps) => {
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
        const filtered = CONTRACT_TYPE_OPTIONS.filter((option) =>
          option.label.toLowerCase().includes(search.toLowerCase())
        );
        return { data: filtered };
      }}
      mapOptions={(data: { data: typeof CONTRACT_TYPE_OPTIONS }) => {
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
      queryKey={[`select-list-contract-types`]}
      allowClear={props.allowClear}
    />
  );
};

export default SelectListContractType;
