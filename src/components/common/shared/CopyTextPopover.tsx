import { CopyOutlined } from "@ant-design/icons";
import { Popover, Tag } from "antd";
import { useCallback, useState } from "react";

interface CopyTextPopoverProps {
    text: string;
    children?: React.ReactNode;
}

const CopyTextPopover = ({ text, children }: CopyTextPopoverProps) => {
    const [visible, setVisible] = useState(false);

    const handleCopyClick = useCallback(
        async (e: React.MouseEvent) => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(text);
            } catch (error) {
                // Optionally show a notification here
                console.error("Error copying text to clipboard", error);
            }
            setVisible(false);
        },
        [text]
    );

    return (
        <Popover
            content={
                <Tag
                    style={{ marginInlineEnd: 0 }}
                    className="cursor-pointer hover:opacity-70 duration-300 px-2"
                    color="green"
                    icon={<CopyOutlined />}
                    onClick={handleCopyClick}
                >
                    Copy
                </Tag>
            }
            trigger="hover"
            open={visible}
            onOpenChange={setVisible}
        >
            {children || <span className="text-green cursor-pointer">{text}</span>}
        </Popover>
    );
};

export default CopyTextPopover;
