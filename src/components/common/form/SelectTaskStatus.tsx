import { Select, type SelectProps } from "antd";
import { TaskStatus } from "@/apis/task";

interface SelectTaskStatusProps extends Omit<SelectProps, 'options'> {
    // Additional props if needed
}

const SelectTaskStatus = (props: SelectTaskStatusProps) => {
    const options = [
        { value: TaskStatus.TODO, label: "Cần làm", color: "#1890ff" },
        { value: TaskStatus.IN_PROGRESS, label: "Đang thực hiện", color: "#13c2c2" },
        { value: TaskStatus.IN_REVIEW, label: "Đang review", color: "#722ed1" },
        { value: TaskStatus.DONE, label: "Hoàn thành", color: "#52c41a" },
        { value: TaskStatus.CANCELLED, label: "Đã hủy", color: "#ff4d4f" },
    ];

    return (
        <Select
            {...props}
            options={options}
            optionRender={(option) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: options.find(o => o.value === option.value)?.color,
                        }}
                    />
                    <span>{option.label}</span>
                </div>
            )}
        />
    );
};

export default SelectTaskStatus;
