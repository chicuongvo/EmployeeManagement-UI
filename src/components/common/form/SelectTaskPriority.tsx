import { Select, type SelectProps, Tag } from "antd";
import { TaskPriority } from "@/apis/task";

interface SelectTaskPriorityProps extends Omit<SelectProps, 'options'> {
    // Additional props if needed
}

const SelectTaskPriority = (props: SelectTaskPriorityProps) => {
    const options = [
        { value: TaskPriority.LOW, label: "Thấp", color: "default" },
        { value: TaskPriority.MEDIUM, label: "Trung bình", color: "blue" },
        { value: TaskPriority.HIGH, label: "Cao", color: "orange" },
        { value: TaskPriority.CRITICAL, label: "Khẩn cấp", color: "red" },
    ];

    return (
        <Select
            {...props}
            options={options}
            optionRender={(option) => (
                <Tag color={options.find(o => o.value === option.value)?.color}>
                    {option.label}
                </Tag>
            )}
        />
    );
};

export default SelectTaskPriority;
