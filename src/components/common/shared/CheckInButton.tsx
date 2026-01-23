import { Divider, message, Modal } from "antd";
import {
  ClockCircleOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { checkIn, type CheckInResponse } from "@/apis/attendance/checkIn";

export const CheckInButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkInResult, setCheckInResult] = useState<CheckInResponse["data"]["data"] | null>(null);

  const { mutate: checkInMutation, isPending } = useMutation({
    mutationFn: () => checkIn(),
    onSuccess: (data: CheckInResponse) => {
      if (data.code === "SUCCESS") {
        setCheckInResult(data.data.data);
        message.success(data.data.message || "Chấm công thành công!");
        // Keep modal open to show result
      } else {
        message.error(data.data.message || "Chấm công thất bại!");
        setIsModalVisible(false);
      }
    },
    onError: (error: unknown) => {
      console.error("Check-in error:", error);
      const errorMessage = 
        (error as { message?: string })?.message || 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Có lỗi xảy ra khi chấm công!";
      message.error(errorMessage);
      setIsModalVisible(false);
    },
  });

  const handleCheckIn = () => {
    setIsModalVisible(true);
    setCheckInResult(null); // Reset result when opening modal
  };

  const handleConfirm = () => {
    checkInMutation();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCheckInResult(null);
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
        className="font-primary"

      >
        Chấm công
      </PrimaryButton>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-green-500" />
            <span className="font-primary">Xác nhận Chấm công</span>
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
          {!checkInResult ? (
            <>
              <p className="text-base mb-2">{currentDate}</p>
              <p className="text-2xl font-semibold text-green-600">{currentTime}</p>
              <p className="mt-4 text-gray-600">
                Bạn có chắc chắn muốn chấm công vào thời điểm này không?
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-base mb-2 font-semibold">Kết quả chấm công:</p>
              {checkInResult.checkinTime && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Giờ vào:</p>
                  <p className="text-xl font-semibold text-green-600">
                    {checkInResult.checkinTime}
                  </p>
                </div>
              )}
              {checkInResult.checkoutTime && 
               checkInResult.checkinTime !== checkInResult.checkoutTime && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Giờ ra:</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {checkInResult.checkoutTime}
                  </p>
                </div>
              )}
              {!checkInResult.checkinTime && !checkInResult.checkoutTime && (
                <p className="text-gray-600">Đã cập nhật thông tin chấm công</p>
              )}
            </div>
          )}
        </div>

        <Divider className=" mt-2" />
        <div className="flex justify-end -mt-2 gap-2">
          {!checkInResult ? (
            <>
              <PrimaryButton
                icon={<SaveOutlined />}
                onClick={handleConfirm}
                color="green"
                loading={isPending}
                disabled={isPending}
              >
                {"Xác nhận"}
              </PrimaryButton>
              <PrimaryButton
                onClick={handleCancel}
                className="bg-transparent border text-green border-green hover:bg-transparent"
                icon={<SyncOutlined className="icon-hover-effect" />}
                key="reset"
                type="button"
                disabled={isPending}
              >
                Hủy
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton
              onClick={handleCancel}
              color="green"
              type="button"
            >
              Đóng
            </PrimaryButton>
          )}
        </div>
      </Modal>
    </>
  );
};
