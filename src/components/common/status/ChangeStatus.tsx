import { Dropdown, Tag } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { WorkStatus as WorkStatusType } from "@/apis/employee/model/Employee";

interface ChangeStatusProps {
    type: "workStatus" | "isActive";
    value: WorkStatusType | boolean;
    onChangeStatus?: (value: WorkStatusType | boolean) => void;
    enabledDropdown?: boolean;
}

// Work Status Configuration
const WORK_STATUS_CONFIG: Record<
    WorkStatusType,
    {
        label: string;
        color: string;
    }
> = {
    WORKING_ONSITE: {
        label: "Đang làm việc",
        color: "green",
    },
    WORK_FROM_HOME: {
        label: "Làm từ xa",
        color: "blue",
    },
    BUSINESS_TRIP: {
        label: "Công tác",
        color: "cyan",
    },
    TRAINING: {
        label: "Đào tạo",
        color: "purple",
    },
    ON_LEAVE_PERSONAL: {
        label: "Nghỉ phép",
        color: "orange",
    },
    ON_LEAVE_SICK: {
        label: "Nghỉ ốm",
        color: "red",
    },
    ON_LEAVE_MATERNITY: {
        label: "Nghỉ thai sản",
        color: "pink",
    },
    ON_LEAVE_VACATION: {
        label: "Nghỉ phép năm",
        color: "lime",
    },
    OFF_DUTY: {
        label: "Nghỉ không lương",
        color: "default",
    },
    ABSENT: {
        label: "Vắng mặt",
        color: "volcano",
    },
    RESIGNED: {
        label: "Đã nghỉ việc",
        color: "default",
    },
    TERMINATED: {
        label: "Bị sa thải",
        color: "error",
    },
    RETIRED: {
        label: "Nghỉ hưu",
        color: "gold",
    },
    ACTIVE: {
        label: "Đang làm việc",
        color: "green",
    },
};

// Active/Inactive Configuration
const ACTIVE_STATUS_CONFIG = {
    true: {
        label: "Đang hoạt động",
        color: "green",
    },
    false: {
        label: "Đã khóa",
        color: "red",
    },
};

const ChangeStatus: React.FC<ChangeStatusProps> = ({
    type,
    value,
    onChangeStatus,
    enabledDropdown = true,
}) => {
    const [currentValue, setCurrentValue] = useState<WorkStatusType | boolean>(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    // Get label and color based on type and currentValue
    const { label, color } = useMemo(() => {
        if (type === "isActive") {
            return ACTIVE_STATUS_CONFIG[String(currentValue) as "true" | "false"];
        }
        return WORK_STATUS_CONFIG[currentValue as WorkStatusType] || { label: String(currentValue), color: "default" };
    }, [type, currentValue]);

    // Get available status options based on current value
    const statusOptions = useMemo(() => {
        if (type === "isActive") {
            // If currently active, can only change to inactive
            // If currently inactive, cannot change back to active
            if (currentValue === true) {
                return [
                    {
                        value: false,
                        label: "Đã khóa",
                        color: "red",
                    },
                ];
            }
            // If inactive, no options (cannot go back to active)
            return [];
        }

        // Work Status options
        const allWorkStatuses: WorkStatusType[] = [
            "WORKING_ONSITE",
            "WORK_FROM_HOME",
            "BUSINESS_TRIP",
            "TRAINING",
            "ON_LEAVE_PERSONAL",
            "ON_LEAVE_SICK",
            "ON_LEAVE_MATERNITY",
            "ON_LEAVE_VACATION",
            "OFF_DUTY",
            "ABSENT",
        ];

        // Filter out terminal statuses and current status
        const terminalStatuses: WorkStatusType[] = ["RESIGNED", "TERMINATED", "RETIRED"];

        return allWorkStatuses
            .filter((status) => status !== currentValue) // Exclude current status
            .map((status) => ({
                value: status,
                label: WORK_STATUS_CONFIG[status].label,
                color: WORK_STATUS_CONFIG[status].color,
            }));
    }, [type, currentValue]);

    const handleChangeStatus = useCallback(
        (newValue: WorkStatusType | boolean) => {
            setCurrentValue(newValue);
            onChangeStatus?.(newValue);
        },
        [onChangeStatus]
    );

    const menuItems = useMemo(
        () =>
            statusOptions.map((item) => ({
                key: String(item.value),
                label: (
                    <Tag
                        className="min-w-24 text-center rounded-md pb-0.5"
                        color={item.color}
                    >
                        {item.label}
                    </Tag>
                ),
                onClick: () => handleChangeStatus(item.value),
            })),
        [statusOptions, handleChangeStatus]
    );

    // If dropdown is disabled or no options available, just show the tag
    if (!enabledDropdown || statusOptions.length === 0) {
        return (
            <Tag
                className="min-w-24 text-center rounded-md pb-0.5 mx-auto"
                color={color}
            >
                {label}
            </Tag>
        );
    }

    return (
        <Dropdown menu={{ items: menuItems }} trigger={["hover"]}>
            <Tag
                className="min-w-24 text-center rounded-md pb-0.5 mx-auto cursor-pointer"
                color={color}
            >
                {label}
            </Tag>
        </Dropdown>
    );
};

export default ChangeStatus;
