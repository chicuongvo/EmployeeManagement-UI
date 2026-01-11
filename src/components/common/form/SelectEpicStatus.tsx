import { Select, type SelectProps } from "antd";
import { EpicStatus } from "@/apis/epic";

interface SelectEpicStatusProps extends Omit<SelectProps, 'options'> {
    // Additional props if needed
}

const SelectEpicStatus = (props: SelectEpicStatusProps) => {
    const options = [
        { value: EpicStatus.TODO, label: "Cần làm", color: "#1890ff" },
        { value: EpicStatus.IN_PROGRESS, label: "Đang thực hiện", color: "#13c2c2" },
        { value: EpicStatus.DONE, label: "Hoàn thành", color: "#52c41a" },
        { value: EpicStatus.CANCELLED, label: "Đã hủy", color: "#ff4d4f" },
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

export default SelectEpicStatus;
