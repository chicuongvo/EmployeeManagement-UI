import React, { useMemo } from "react";
import { Tooltip } from "antd";

interface TooltipTruncatedTextProps {
    value: string | Array<{ id: string | number; name: string }> | null | undefined;
    maxLength?: number;
    separator?: string;
    className?: string;
    textAlign?: "text-start" | "text-center" | "text-end";
    placement?: "top" | "bottom" | "left" | "right";
}

const TooltipTruncatedText: React.FC<TooltipTruncatedTextProps> = ({
    value,
    maxLength = 30,
    separator = ", ",
    className = "",
    textAlign = "text-start",
    placement = "top",
}) => {
    if (!value) {
        return
    }

    const displayText = useMemo(() => {
        if (Array.isArray(value)) {
            return !!value?.length ? value.map(item => item.name).join(separator) : "";
        } else {
            return value;
        }
    }, [value, separator]);

    const isTextLong = displayText.length > maxLength;

    if (isTextLong) {
        return (
            <Tooltip title={displayText} placement={placement} className={`${textAlign} ${className}`}>
                <div className={`truncate hover:bg-gray-50 transition-colors duration-200 ${textAlign}`}>
                    {displayText}
                </div>
            </Tooltip>
        );
    }

    return (
        <div className={`${textAlign} ${className}`}>
            {displayText}
        </div>
    );
};

export default TooltipTruncatedText;
