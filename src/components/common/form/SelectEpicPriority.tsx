import { Select, type SelectProps, Tag } from "antd";
import { EpicPriority } from "@/apis/epic";

interface SelectEpicPriorityProps extends Omit<SelectProps, 'options'> {
    // Additional props if needed
}

const SelectEpicPriority = (props: SelectEpicPriorityProps) => {
    const options = [
        { value: EpicPriority.LOW, label: "Thấp", color: "default" },
        { value: EpicPriority.MEDIUM, label: "Trung bình", color: "blue" },
        { value: EpicPriority.HIGH, label: "Cao", color: "orange" },
        { value: EpicPriority.CRITICAL, label: "Khẩn cấp", color: "red" },
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

export default SelectEpicPriority;
