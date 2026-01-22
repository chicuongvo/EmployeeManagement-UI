import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import type { MeetingResponse, CreateMeetingRequest } from "@/types/Meeting";
import { message } from "antd";

interface MeetingFormProps {
  initialData?: MeetingResponse | null;
  onSubmit: (data: CreateMeetingRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: {
    title: string;
    scheduledAt: dayjs.Dayjs | null;
    participantIds: number[];
  }) => void;
}

export function MeetingForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
  hideSubmitButton = false,
  onFormDataChange,
}: MeetingFormProps) {
  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    scheduledAt: initialData?.scheduledAt
      ? dayjs(initialData.scheduledAt)
      : null,
    participantIds: [] as number[],
  });

  // Notify parent component when form data changes
  React.useEffect(() => {
    onFormDataChange?.({
      title: formData.title,
      scheduledAt: formData.scheduledAt,
      participantIds: formData.participantIds,
    });
  }, [formData, onFormDataChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      message.error("Vui lòng nhập tên cuộc họp");
      return;
    }

    if (!formData.scheduledAt) {
      message.error("Vui lòng chọn thời gian bắt đầu");
      return;
    }

    const submitData: CreateMeetingRequest = {
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      scheduledAt: formData.scheduledAt.toISOString(),
      participantIds:
        formData.participantIds.length > 0
          ? formData.participantIds
          : undefined,
    };

    await onSubmit(submitData);
  };

  return (
    <form
      id="meeting-form"
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="space-y-3">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
          Tên cuộc họp *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nhập tên cuộc họp"
          required
          disabled={isLoading}
          className="text-base h-12 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="scheduledAt"
          className="text-sm font-semibold text-gray-700"
        >
          Thời gian bắt đầu *
        </Label>
        <DatePicker
          id="scheduledAt"
          showTime
          format="DD/MM/YYYY HH:mm"
          value={formData.scheduledAt}
          onChange={(date) => setFormData({ ...formData, scheduledAt: date })}
          placeholder="Chọn thời gian bắt đầu"
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "8px",
            borderColor: "#d1d5db",
            backgroundColor: "#ffffff",
          }}
          className="text-base shadow-sm hover:border-blue-400 focus:border-blue-500"
          disabled={isLoading}
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
        />
      </div>

      <div className="space-y-3 w-full">
        <Label
          htmlFor="participantIds"
          className="text-sm font-semibold text-gray-700"
        >
          Người tham gia
        </Label>
        <SelectListEmployee
          mode="multiple"
          placeholder="Chọn người tham gia (có thể chọn nhiều)"
          value={formData.participantIds}
          onChange={(values) =>
            setFormData({
              ...formData,
              participantIds: (values || []) as number[],
            })
          }
          allowClear
          disabled={isLoading}
          className="w-full text-base"
          style={{
            minHeight: "48px",
            borderRadius: "8px",
            borderColor: "#d1d5db",
            backgroundColor: "#ffffff",
          }}
          size="large"
          showSelectAll={true}
        />
        <p className="text-sm text-gray-600">
          Chọn các nhân viên được phép tham gia cuộc họp. Sử dụng nút "Chọn tất
          cả" để chọn tất cả nhân viên.
        </p>
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="description"
          className="text-sm font-semibold text-gray-700"
        >
          Mô tả / Agenda
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Nhập mô tả hoặc agenda cho cuộc họp (có thể xuống dòng)"
          rows={12}
          disabled={isLoading}
          className="min-h-[300px] text-base border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm resize-none"
        />
        <p className="text-sm text-gray-600">
          Nhập các điểm cần thảo luận trong cuộc họp (mỗi điểm một dòng)
        </p>
      </div>

      {!hideSubmitButton && (
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-colors duration-200 font-medium"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-all duration-200 font-medium shadow-sm"
          >
            {isLoading
              ? "Đang xử lý..."
              : mode === "create"
                ? "Tạo cuộc họp"
                : "Cập nhật"}
          </button>
        </div>
      )}
    </form>
  );
}
