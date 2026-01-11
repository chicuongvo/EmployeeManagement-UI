import { Select, type SelectProps } from "antd";
import { ProjectStatus } from "@/apis/project";

interface SelectProjectStatusProps extends Omit<SelectProps, "options"> { }

const projectStatusOptions = [
    { value: ProjectStatus.PLANNING, label: "Đang lập kế hoạch" },
    { value: ProjectStatus.IN_PROGRESS, label: "Đang thực hiện" },
    { value: ProjectStatus.ON_HOLD, label: "Tạm dừng" },
    { value: ProjectStatus.COMPLETED, label: "Hoàn thành" },
    { value: ProjectStatus.CANCELLED, label: "Đã hủy" },
];

const SelectProjectStatus = (props: SelectProjectStatusProps) => {
    return <Select {...props} options={projectStatusOptions} />;
};

export default SelectProjectStatus;
