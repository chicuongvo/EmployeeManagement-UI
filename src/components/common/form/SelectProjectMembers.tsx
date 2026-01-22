import type { SelectProps } from "antd";
import { Avatar, Select, Spin } from "antd";
import { useMemo } from "react";

interface SelectProjectMembersProps extends SelectProps {
  members: Array<{
    employee: {
      id: number;
      fullName: string;
      employeeCode: string;
      avatar?: string | null;
    };
  }>;
  loading?: boolean;
}

const SelectProjectMembers = ({
  members = [],
  loading = false,
  ...props
}: SelectProjectMembersProps) => {
  const options = useMemo(() => {
    return members.map((member) => ({
      value: member.employee.id,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "4px 0",
          }}
        >
          <Avatar
            src={
              member.employee.avatar ??
              "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
            }
            size="large"
            style={{ flexShrink: 0 }}
          />
          <span
            style={{ fontSize: "15px", fontWeight: 500 }}
          >{`${member.employee.fullName} - #${member.employee.employeeCode}`}</span>
        </div>
      ),
      title: `${member.employee.fullName} - #${member.employee.employeeCode}`,
    }));
  }, [members]);

  return (
    <Select
      {...props}
      options={options}
      optionLabelProp="title"
      showSearch
      filterOption={(input, option) =>
        (option?.title ?? "").toLowerCase().includes(input.toLowerCase())
      }
      notFoundContent={loading ? <Spin size="small" /> : "Không có thành viên"}
      placeholder="Chọn người thực hiện..."
    />
  );
};

export default SelectProjectMembers;
