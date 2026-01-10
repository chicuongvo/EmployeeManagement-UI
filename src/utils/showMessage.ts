import { Modal, notification } from "antd";
import { toast } from "sonner";

export type MessageType = "toast" | "modal";

export type MessageLevel = "info" | "success" | "warning" | "error";

type Props = {
    type?: MessageType;
    level: MessageLevel;
    title: string | React.ReactNode;
    content?: string | React.ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
    duration?: number;
};

const showMessage = ({
    type,
    level,
    title,
    content,
    onOk,
    onCancel,
    onClose,
    duration,
}: Props) => {
    switch (type) {
        case "modal":
            Modal[level]({
                title,
                content,
                onOk,
                onCancel,
                afterClose: onClose,
            });
            break;
        case "toast":
            toast[level](content || title, {
                onAutoClose: onClose,
                closeButton: true,
            });
            break;
        default:
            notification.success({
                message: title,
                description: content,
                onClose,
                duration,
            });
            break;
    }
};

export default showMessage;
