import { Divider, message, Modal } from "antd";
import {
  ClockCircleOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PrimaryButton from "@/components/common/button/PrimaryButton";

interface CheckInResponse {
  success: boolean;
  message: string;
  data?: {
    checkinTime: string;
  };
}

const checkInAPI = async (): Promise<CheckInResponse> => {
  // TODO: Replace with actual API endpoint
  // For now, simulating a check-in
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Check-in thành công",
        data: {
          checkinTime: new Date().toISOString(),
        },
      });
    }, 500);
  });
};

export const CheckInButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { mutate: checkIn, isPending } = useMutation({
    mutationFn: checkInAPI,
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || "Check-in thành công!");
        setIsModalVisible(false);
      } else {
        message.error(data.message || "Check-in thất bại!");
      }
    },
    onError: (error) => {
      console.error("Check-in error:", error);
      message.error("Có lỗi xảy ra khi check-in!");
    },
  });

  const handleCheckIn = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    checkIn();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const currentTime = new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <PrimaryButton
        color="green"
        icon={<ClockCircleOutlined className="icon-hover-green" />}
        onClick={handleCheckIn}
      >
        Check-in
      </PrimaryButton>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-green-500" />
            <span className="font-primary">Xác nhận Check-in</span>
          </div>
        }
        open={isModalVisible}
        // onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Xác nhận"
        // cancelText="Hủy"
        confirmLoading={isPending}
        className="font-primary"
        footer={null}
      >
        <div className="py-4">
          <p className="text-base mb-2">{currentDate}</p>
          <p className="text-2xl font-semibold text-green-600">{currentTime}</p>
          <p className="mt-4 text-gray-600">
            Bạn có chắc chắn muốn check-in vào thời điểm này không?
          </p>
        </div>

        <Divider className=" mt-2" />
        <div className="flex justify-end -mt-2 gap-2">
          <PrimaryButton
            icon={<SaveOutlined />}
            onClick={handleConfirm}
            color="green"
            loading={isPending}
            disabled={false}
          >
            {"Xác nhận"}
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              handleCancel();
            }}
            className="bg-transparent border text-green border-green hover:bg-transparent"
            icon={<SyncOutlined className="icon-hover-effect" />}
            key="reset"
            type="button"
          >
            Hủy{" "}
          </PrimaryButton>
        </div>
      </Modal>
    </>
  );
};
