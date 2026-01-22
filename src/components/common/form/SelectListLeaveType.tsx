import type { SelectProps } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import { getListLeaveType } from "@/apis/leave-type/getListLeaveType";
import type { GetListLeaveTypeResponse } from "@/apis/leave-type/model/LeaveType";

interface SelectListLeaveTypeProps extends SelectProps {
  showMaxDays?: boolean;
}

const SelectListLeaveType = ({
  showMaxDays = false,
  ...props
}: SelectListLeaveTypeProps) => {
  return (
    <SelectListGeneric
      {...props}
      fetcher={(search) =>
        getListLeaveType({
          name: search || undefined,
          isDeleted: false,
          limit: 100,
        })
      }
      mapOptions={(data: GetListLeaveTypeResponse) => {
        return (
          data?.data.data
            ?.filter((type) => !type.isDeleted)
            .map((type) => ({
              value: type.id,
              label: showMaxDays
                ? `${type.name} (Tối đa: ${type.maxDays} ngày)`
                : type.name,
              title: type.name,
            })) || []
        );
      }}
      customFilterOption={(input, option) => {
        const title = option?.title || "";
        return title.toLowerCase().includes(input.toLowerCase());
      }}
      queryKey={["select-list-leave-types"]}
      showSearch
    />
  );
};

export default SelectListLeaveType;
