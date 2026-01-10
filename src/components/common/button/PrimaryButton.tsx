import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useMemo, useState } from "react";
import { cn } from "@/libs/utils";

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    color?: "green" | "orange" | "blue" | "red" | "white";
};

const PrimaryButton = ({
    children,
    icon,
    loading,
    className = "",
    color,
    disabled,
    ...props
}: Props) => {
    const [clicked, setClicked] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setClicked(true);
        setTimeout(() => setClicked(false), 400);
        if (disabled) {
            e.preventDefault();
            return;
        }
        props.onClick?.(e);
    };

    const colorClasses = useMemo(() => {
        switch (color) {
            case "green":
                return "btn-green";
            case "orange":
                return "btn-orange";
            case "blue":
                return "btn-blue";
            case "red":
                return "btn-red";
            case "white":
                return "btn-white";
            default:
                return "bg-primary-100 hover:bg-primary-200";
        }
    }, [color]);

    const colorClickedClasses = useMemo(() => {
        switch (color) {
            case "green":
                return "animate-click-ring-green";
            case "orange":
                return "animate-click-ring-orange";
            case "blue":
                return "animate-click-ring-blue";
            case "red":
                return "animate-click-ring-red";
            default:
                return "animate-click-ring-green";
        }
    }, [color]);

    return (
        <button
            {...props}
            onClick={handleClick}
            className={cn(
                `relative focus:outline-none group overflow-hidden rounded-md h-[35px] px-4 duration-200 text-white flex items-center justify-center gap-2 ${disabled
                    ? "bg-gray-100 cursor-not-allowed border border-gray-200 text-gray-300"
                    : colorClasses
                }`,
                clicked ? `${disabled ? "" : colorClickedClasses}` : "",
                className
            )}
        >
            {loading ? (
                <Spin
                    indicator={<LoadingOutlined className="text-primary-100" spin />}
                    size="small"
                />
            ) : (
                icon
            )}
            {children}
            <span className="absolute inset-0 pointer-events-none z-10 rounded-md" />
        </button>
    );
};

export default PrimaryButton;
