import type { SelectProps } from "antd";
import { Avatar } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import { getListEmployee } from "@/apis/employee/getListEmployee";
import type { GetListEmployeeResponse } from "@/apis/employee/model/Employee";

interface SelectListEmployeeProps extends SelectProps {
  defaultValue?: { id: number; name: string }[];
}

const SelectListEmployee = ({
  defaultValue = [],
  ...props
}: SelectListEmployeeProps) => {
  // const [extraOptions, setExtraOptions] = useState<
  //   { value: number; label: string }[]
  // >([]);

  // const fetchMissingOptions = useCallback(async (ids: number[]) => {
  //   for (const id of ids) {
  //     try {
  //       const employee = await getEmployee(id);

  //       if (employee) {
  //         setExtraOptions((prev) => {
  //           // Check if already exists
  //           if (prev.some((p) => p.value === employee.id)) return prev;

  //           return [
  //             ...prev,
  //             {
  //               value: employee.id,
  //               label: `${employee.name} (${employee.employeeCode})`,
  //             },
  //           ];
  //         });
  //       }
  //     } catch (e) {
  //       console.error("Failed to fetch employee", id, e);
  //     }
  //   }
  // }, []);

  return (
    <SelectListGeneric
      {...props}
      styles={{
        popup: {
          root: {
            maxHeight: 400,
            overflowY: "auto",
          },
        },
      }}
      optionLabelProp="title"
      fetcher={(search) =>
        getListEmployee({
          q: search,
        })
      }
      mapOptions={(data: GetListEmployeeResponse) => {
        // Options from search results with avatar
        const options =
          data?.data.data?.map((d) => ({
            value: d.id,
            label: (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
                <Avatar
                  src={
                    d.avatar ??
                    "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
                  }
                  size="large"
                  style={{ flexShrink: 0 }}
                ></Avatar>
                <span style={{ fontSize: "15px", fontWeight: 500 }}>{`${d.fullName} - #${d.employeeCode}`}</span>
              </div>
            ),
            title: `${d.fullName} - #${d.employeeCode}`, // For search/filter
            avatar: d.avatar,
            fullName: d.fullName,
            employeeCode: d.employeeCode,
          })) || [];

        // Default options
        const defaultOptions = defaultValue.map((item) => ({
          value: item.id,
          label: (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
              <Avatar size="large" style={{ flexShrink: 0 }}>
                {item.name?.charAt(0)?.toUpperCase() || "?"}
              </Avatar>
              <span style={{ fontSize: "15px", fontWeight: 500 }}>{item.name}</span>
            </div>
          ),
          title: item.name, // For search/filter
        }));

        // Merge all options
        const mergedOptions = [
          ...defaultOptions,
          ...options.filter(
            (option) =>
              !defaultOptions.some((item) => item.value === option.value),
          ),
        ];

        return mergedOptions;
      }}
      customFilterOption={(input, option) => {
        // Filter based on title (text) instead of label (ReactNode)
        const title = option?.title || "";
        return title.toLowerCase().includes(input.toLowerCase());
      }}
      queryKey={[`select-list-employees`]}
      allowClear={props.allowClear}
    />
  );
};

export default SelectListEmployee;
